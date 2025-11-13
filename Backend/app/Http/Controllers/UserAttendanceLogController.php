<?php

namespace App\Http\Controllers;

use App\Models\UserAttendanceLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserAttendanceLogController extends Controller
{
    // ==================== STAFF ATTENDANCE SYSTEM ====================

    /**
     * Get all attendance logs for staff view
     */
    public function getAllAttendance(Request $request): JsonResponse
    {
        try {
            $attendanceLogs = UserAttendanceLog::with('user')
                ->orderBy('check_in', 'desc')
                ->get();

            $formattedLogs = $attendanceLogs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user_id' => $log->user_id,
                    'user_code' => $log->user->user_id,
                    'user_name' => $log->user->name,
                    'check_in' => $log->check_in,
                    'check_out' => $log->check_out,
                ];
            });

            return response()->json($formattedLogs);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attendance logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check in user by user_id - SIMPLIFIED
     */
    public function checkInByUserId(Request $request): JsonResponse
    {
        Log::info("🔐 Checkin started by staff for user: {$request->user_id}");

        try {
            DB::beginTransaction();

            $request->validate([
                'user_id' => 'required|string'
            ]);

            $user = User::where('user_id', $request->user_id)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found with this ID'
                ], 404);
            }

            // Check if user already has an active session today
            $activeSession = UserAttendanceLog::where('user_id', $user->id)
                ->whereDate('check_in', Carbon::today())
                ->whereNull('check_out')
                ->first();
                
            if ($activeSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'User already has an active session today'
                ], 400);
            }

            $attendanceLog = UserAttendanceLog::create([
                'user_id' => $user->id,
                'check_in' => now(),
            ]);

            DB::commit();
            
            Log::info("✅ Checkin completed successfully for user: {$user->id}");

            return response()->json([
                'success' => true,
                'message' => 'Check-in successful for ' . $user->name,
                'data' => [
                    'id' => $attendanceLog->id,
                    'user_name' => $user->name,
                    'user_code' => $user->user_id,
                    'check_in' => Carbon::parse($attendanceLog->check_in)->format('g:i A'),
                    'date' => Carbon::parse($attendanceLog->check_in)->format('Y-m-d'),
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('❌ Checkin failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Check-in failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check out user by attendance log ID - SIMPLIFIED
     */
    public function checkOutByLogId($id): JsonResponse
    {
        Log::info("🔐 Checkout started for attendance log: {$id}");

        try {
            DB::beginTransaction();

            $attendanceLog = UserAttendanceLog::where('id', $id)
                ->whereNull('check_out')
                ->first();
                
            if (!$attendanceLog) {
                Log::warning("No active session found for checkout: {$id}");
                return response()->json([
                    'success' => false,
                    'message' => 'No active session found or session already completed'
                ], 404);
            }
            
            Log::info("Checking out user: {$attendanceLog->user_id} for attendance: {$id}");
            
            // Use direct database update to avoid model events
            DB::table('user_attendance_logs')
                ->where('id', $id)
                ->whereNull('check_out')
                ->update([
                    'check_out' => now(),
                    'updated_at' => now()
                ]);
                
            // Refresh the model to get updated data
            $attendanceLog->refresh();

            $user = User::find($attendanceLog->user_id);
            
            $checkInTime = Carbon::parse($attendanceLog->check_in);
            $checkOutTime = Carbon::parse($attendanceLog->check_out);
            $duration = $this->calculateDuration($checkInTime, $checkOutTime);
            
            DB::commit();
            
            Log::info("✅ Checkout completed successfully for user: {$attendanceLog->user_id}");
            
            return response()->json([
                'success' => true,
                'message' => 'Check-out successful for ' . $user->name,
                'data' => [
                    'user_name' => $user->name,
                    'user_code' => $user->user_id,
                    'check_in' => $checkInTime->format('g:i A'),
                    'check_out' => $checkOutTime->format('g:i A'),
                    'duration' => $duration,
                    'total_hours' => $checkInTime->diffInHours($checkOutTime),
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('❌ Checkout failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Check-out failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ==================== MEMBER PERSONAL ATTENDANCE ====================

    /**
     * Get attendance logs for authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $query = UserAttendanceLog::where('user_id', $user->id)
                ->orderBy('check_in', 'desc');
            
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('check_in', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay()
                ]);
            } else {
                $query->where('check_in', '>=', Carbon::now()->subDays(30));
            }
            
            $attendanceLogs = $query->get();
            
            $formattedLogs = $attendanceLogs->map(function ($log) {
                $checkInTime = Carbon::parse($log->check_in);
                $checkOutTime = $log->check_out ? Carbon::parse($log->check_out) : null;
                
                $duration = $this->calculateDuration($checkInTime, $checkOutTime);
                
                return [
                    'id' => $log->id,
                    'date' => $checkInTime->format('Y-m-d'),
                    'check_in' => $checkInTime->format('g:i A'),
                    'check_out' => $checkOutTime ? $checkOutTime->format('g:i A') : null,
                    'status' => $checkOutTime ? 'completed' : 'active',
                    'duration' => $duration,
                    'total_hours' => $checkOutTime ? $checkInTime->diffInHours($checkOutTime) : null,
                ];
            });
            
            $totalSessions = $attendanceLogs->count();
            $totalHours = $attendanceLogs->whereNotNull('check_out')
                ->sum(function($log) {
                    return Carbon::parse($log->check_in)->diffInHours(Carbon::parse($log->check_out));
                });
            $avgDuration = $totalSessions > 0 ? round($totalHours / $totalSessions, 1) : 0;
            
            return response()->json([
                'success' => true,
                'attendance_logs' => $formattedLogs,
                'statistics' => [
                    'total_sessions' => $totalSessions,
                    'total_hours' => round($totalHours, 1),
                    'average_duration' => $avgDuration,
                    'current_streak' => $this->calculateCurrentStreak($user->id),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attendance logs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check in user (for member self check-in)
     */
    public function checkIn(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $activeSession = UserAttendanceLog::where('user_id', $user->id)
                ->whereDate('check_in', Carbon::today())
                ->whereNull('check_out')
                ->first();
                
            if ($activeSession) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active session today'
                ], 400);
            }
            
            $attendanceLog = UserAttendanceLog::create([
                'user_id' => $user->id,
                'check_in' => now(),
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Check-in successful! Welcome to the gym.',
                'data' => [
                    'id' => $attendanceLog->id,
                    'check_in' => Carbon::parse($attendanceLog->check_in)->format('g:i A'),
                    'date' => Carbon::parse($attendanceLog->check_in)->format('Y-m-d'),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Check-in failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check out user (for member self check-out)
     */
    public function checkOut(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            
            $attendanceLog = UserAttendanceLog::where('user_id', $user->id)
                ->where('id', $id)
                ->whereNull('check_out')
                ->first();
                
            if (!$attendanceLog) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active session found or session already completed'
                ], 404);
            }
            
            $attendanceLog->update([
                'check_out' => now()
            ]);
            
            $checkInTime = Carbon::parse($attendanceLog->check_in);
            $checkOutTime = Carbon::parse($attendanceLog->check_out);
            $duration = $this->calculateDuration($checkInTime, $checkOutTime);
            
            return response()->json([
                'success' => true,
                'message' => 'Check-out successful! Thank you for your visit.',
                'data' => [
                    'check_in' => $checkInTime->format('g:i A'),
                    'check_out' => $checkOutTime->format('g:i A'),
                    'duration' => $duration,
                    'total_hours' => $checkInTime->diffInHours($checkOutTime),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Check-out failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Calculate duration in human readable format
     */
    private function calculateDuration($checkInTime, $checkOutTime): string
    {
        if (!$checkOutTime) {
            return "Currently in gym";
        }
        
        $durationHours = $checkInTime->diffInHours($checkOutTime);
        $durationMinutes = $checkInTime->diffInMinutes($checkOutTime) % 60;
        
        if ($durationHours > 0) {
            return $durationMinutes > 0 
                ? "{$durationHours}h {$durationMinutes}m"
                : "{$durationHours}h";
        } else {
            return "{$durationMinutes}m";
        }
    }

    /**
     * Calculate current streak for user
     */
    private function calculateCurrentStreak($userId): int
    {
        $streak = 0;
        $currentDate = Carbon::today();
        
        while (true) {
            $hasSession = UserAttendanceLog::where('user_id', $userId)
                ->whereDate('check_in', $currentDate)
                ->whereNotNull('check_out')
                ->exists();
                
            if ($hasSession) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }
        
        return $streak;
    }

    // Remove all the complex session management methods:
    // - storeCurrentSession()
    // - restoreUserSession() 
    // - refreshSanctumToken()
    // - refreshWebSession()
    // - testSessionProtection()
}