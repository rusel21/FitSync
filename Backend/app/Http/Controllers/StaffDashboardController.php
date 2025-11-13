<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Membership;
use App\Models\UserAttendanceLog;
use Carbon\Carbon;

class StaffDashboardController extends Controller
{
    /**
     * Get staff dashboard data
     */
    public function getDashboard(Request $request)
    {
        $staff = $request->user();

        // Today's statistics
        $todayCheckins = UserAttendanceLog::whereDate('check_in', Carbon::today())->count();
        $activeMemberships = Membership::where('status', 'active')->count();
        $totalMembers = User::where('role', 'user')->count();
        
        // Recent check-ins (last 5)
        $recentCheckins = UserAttendanceLog::with('user')
            ->whereDate('check_in', Carbon::today())
            ->orderBy('check_in', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'user_name' => $log->user->name,
                    'user_id' => $log->user->user_id,
                    'check_in' => $log->check_in->format('g:i A'),
                    'check_out' => $log->check_out ? $log->check_out->format('g:i A') : null
                ];
            });

        // Membership statistics
        $membershipStats = Membership::select('type')
            ->selectRaw('COUNT(*) as count')
            ->where('status', 'active')
            ->groupBy('type')
            ->get();

        return response()->json([
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'role' => $staff->role
            ],
            'today_stats' => [
                'checkins_today' => $todayCheckins,
                'active_memberships' => $activeMemberships,
                'total_members' => $totalMembers,
                'attendance_rate' => $totalMembers > 0 ? round(($todayCheckins / $totalMembers) * 100) : 0
            ],
            'recent_checkins' => $recentCheckins,
            'membership_stats' => $membershipStats,
            'quick_actions' => [
                'check_member' => true,
                'manage_members' => true,
                'view_reports' => $staff->isManager(),
                'manage_staff' => $staff->isManager()
            ]
        ]);
    }

    /**
     * Get today's attendance summary
     */
    public function getTodayAttendance()
    {
        $today = Carbon::today();
        
        $attendance = UserAttendanceLog::with('user')
            ->whereDate('check_in', $today)
            ->orderBy('check_in', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'attendance_id' => $log->id,
                    'user_name' => $log->user->name,
                    'user_id' => $log->user->user_id,
                    'check_in' => $log->check_in->format('Y-m-d H:i:s'),
                    'check_out' => $log->check_out ? $log->check_out->format('Y-m-d H:i:s') : null,
                    'duration' => $log->check_out ? $log->check_in->diffInHours($log->check_out) . ' hours' : 'Active',
                    'status' => $log->check_out ? 'Completed' : 'Checked In'
                ];
            });

        return response()->json([
            'date' => $today->format('Y-m-d'),
            'total_checkins' => $attendance->count(),
            'active_sessions' => $attendance->where('status', 'Checked In')->count(),
            'attendance' => $attendance
        ]);
    }
}