<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Membership;
use App\Models\UserAttendanceLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AdminMemberController extends Controller
{
    /**
     * Get all users for admin member management
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $query = User::with(['currentMembership', 'attendanceLogs' => function($q) {
                $q->orderBy('check_in', 'desc')->limit(1);
            }]);

            // Apply search filter if provided
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('user_id', 'like', "%{$search}%");
                });
            }

            // Apply membership filter if provided
            if ($request->has('membership_type') && $request->membership_type) {
                $query->where('membership_type', $request->membership_type);
            }

            $users = $query->orderBy('created_at', 'desc')->get();

            $formattedUsers = $users->map(function ($user) {
                $lastCheckin = $user->attendanceLogs->first();
                
                return [
                    'id' => $user->id,
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'gender' => $user->gender,
                    'address' => $user->address,
                    'contact' => $user->contact,
                    'role' => $user->role,
                    'picture' => $user->picture,
                    'membership_type' => $user->membership_type,
                    'created_at' => $user->created_at,
                    'last_checkin' => $lastCheckin ? $lastCheckin->check_in : null,
                    'membership_status' => $user->currentMembership ? 'Active' : 'Inactive',
                ];
            });

            return response()->json([
                'success' => true,
                'users' => $formattedUsers,
                'total' => $users->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user information
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'gender' => 'sometimes|string|in:Male,Female,Other',
                'address' => 'sometimes|string|max:500',
                'contact' => 'sometimes|string|max:20',
                'membership_type' => 'sometimes|string|max:255',
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get member analytics for admin dashboard
     */
    public function getAnalytics(Request $request): JsonResponse
    {
        try {
            $totalMembers = User::count();
            $activeMembers = User::whereHas('currentMembership')->count();
            
            // New members this month
            $newThisMonth = User::whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count();

            // Membership distribution
            $membershipDistribution = User::select('membership_type', DB::raw('COUNT(*) as count'))
                ->whereNotNull('membership_type')
                ->where('membership_type', '!=', '')
                ->groupBy('membership_type')
                ->get()
                ->pluck('count', 'membership_type')
                ->toArray();

            // Calculate average weekly visits
            $avgVisitsPerWeek = UserAttendanceLog::where('check_in', '>=', now()->subMonth())
                ->select(DB::raw('COUNT(*) / 4 as average_visits')) // 4 weeks
                ->value('average_visits') ?? 0;

            // Calculate retention rate (users with attendance in last 30 days / total active members)
            $activeUsersWithRecentAttendance = User::whereHas('attendanceLogs', function($q) {
                $q->where('check_in', '>=', now()->subDays(30));
            })->count();

            $retentionRate = $activeMembers > 0 ? round(($activeUsersWithRecentAttendance / $activeMembers) * 100, 1) . '%' : '0%';

            return response()->json([
                'success' => true,
                'totalMembers' => $totalMembers,
                'activeMembers' => $activeMembers,
                'newThisMonth' => $newThisMonth,
                'avgVisitsPerWeek' => round($avgVisitsPerWeek, 1),
                'membershipDistribution' => $membershipDistribution,
                'retentionRate' => $retentionRate
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching analytics: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate analytics report
     */
    public function generateAnalyticsReport(Request $request): JsonResponse
    {
        try {
            $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->subMonth();
            $endDate = $request->end_date ? Carbon::parse($request->end_date) : now();

            // Generate report data based on date range
            $newMembers = User::whereBetween('created_at', [$startDate, $endDate])->count();
            
            $totalRevenue = DB::table('payments')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount') ?? 0;

            $membershipBreakdown = User::select('membership_type', DB::raw('COUNT(*) as count'))
                ->whereNotNull('membership_type')
                ->where('membership_type', '!=', '')
                ->groupBy('membership_type')
                ->get();

            // Get attendance trends
            $attendanceByDay = UserAttendanceLog::whereBetween('check_in', [$startDate, $endDate])
                ->select(DB::raw('DAYNAME(check_in) as day'), DB::raw('COUNT(*) as count'))
                ->groupBy(DB::raw('DAYNAME(check_in)'))
                ->orderBy('count', 'desc')
                ->limit(3)
                ->get()
                ->pluck('day')
                ->toArray();

            $reportData = [
                'report_period' => [
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString()
                ],
                'summary' => [
                    'total_members' => User::count(),
                    'new_members' => $newMembers,
                    'active_members' => User::whereHas('currentMembership')->count(),
                    'total_revenue' => $totalRevenue
                ],
                'membership_breakdown' => $membershipBreakdown,
                'attendance_trends' => [
                    'average_weekly_visits' => UserAttendanceLog::whereBetween('check_in', [$startDate, $endDate])
                        ->select(DB::raw('COUNT(*) / FLOOR(DATEDIFF(?, ?) / 7) as average_visits'))
                        ->setBindings([$endDate, $startDate])
                        ->value('average_visits') ?? 0,
                    'peak_days' => $attendanceByDay,
                    'peak_hours' => $this->getPeakHours($startDate, $endDate)
                ],
                'generated_at' => now()->toDateTimeString(),
                'generated_by' => $request->user()->name
            ];

            return response()->json([
                'success' => true,
                'data' => $reportData
            ]);

        } catch (\Exception $e) {
            Log::error('Error generating report: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get member details
     */
    public function getMemberDetails($id): JsonResponse
    {
        try {
            $member = User::with(['currentMembership', 'attendanceLogs' => function($q) {
                $q->orderBy('check_in', 'desc')->limit(10);
            }, 'payments' => function($q) {
                $q->orderBy('created_at', 'desc')->limit(5);
            }])->findOrFail($id);

            $totalVisits = $member->attendanceLogs->count();
            $lastVisit = $member->attendanceLogs->first();

            $memberDetails = [
                'user' => $member,
                'statistics' => [
                    'total_visits' => $totalVisits,
                    'last_visit' => $lastVisit ? $lastVisit->check_in : null,
                    'average_duration' => $this->calculateAverageDuration($member->id),
                    'total_payments' => $member->payments->count(),
                    'total_amount_paid' => $member->payments->sum('amount')
                ]
            ];

            return response()->json([
                'success' => true,
                'member' => $memberDetails
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching member details: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch member details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate average duration for a user
     */
    private function calculateAverageDuration($userId): string
    {
        $logs = UserAttendanceLog::where('user_id', $userId)
            ->whereNotNull('check_out')
            ->get();

        if ($logs->isEmpty()) {
            return '0h 0m';
        }

        $totalMinutes = $logs->sum(function($log) {
            return Carbon::parse($log->check_in)->diffInMinutes(Carbon::parse($log->check_out));
        });

        $averageMinutes = $totalMinutes / $logs->count();
        $hours = floor($averageMinutes / 60);
        $minutes = $averageMinutes % 60;

        return "{$hours}h {$minutes}m";
    }

    /**
     * Get peak hours from attendance data
     */
    private function getPeakHours($startDate, $endDate): array
    {
        $peakHours = UserAttendanceLog::whereBetween('check_in', [$startDate, $endDate])
            ->select(DB::raw('HOUR(check_in) as hour'), DB::raw('COUNT(*) as count'))
            ->groupBy(DB::raw('HOUR(check_in)'))
            ->orderBy('count', 'desc')
            ->limit(3)
            ->get()
            ->map(function($item) {
                $nextHour = ($item->hour + 1) % 24;
                return sprintf('%02d:00-%02d:00', $item->hour, $nextHour);
            })
            ->toArray();

        return array_pad($peakHours, 3, 'N/A');
    }
}