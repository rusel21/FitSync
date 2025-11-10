<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Membership;
use App\Models\Payment;
use App\Models\UserAttendanceLog;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get user dashboard data
     */
    public function getUserDashboard(Request $request)
    {
        $user = $request->user();
        
        // Get current membership
        $currentMembership = $user->currentMembership;
        
        // Get attendance stats for current month
        $attendanceStats = $this->getAttendanceStats($user);
        
        // Get workout stats
        $workoutStats = $this->getWorkoutStats($user);
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities($user);
        
        // Get membership progress
        $membershipProgress = $this->getMembershipProgress($currentMembership);

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'membership_type' => $user->membership_type,
                'user_id' => $user->user_id,
            ],
            'membership' => $currentMembership ? [
                'type' => $currentMembership->type,
                'status' => $currentMembership->status,
                'start_date' => $currentMembership->start_date->format('Y-m-d'),
                'end_date' => $currentMembership->end_date->format('Y-m-d'),
                'days_remaining' => $currentMembership->days_remaining,
                'is_active' => $currentMembership->isActive(),
                'progress_percentage' => $membershipProgress['percentage'],
                'progress_days_used' => $membershipProgress['days_used'],
                'progress_total_days' => $membershipProgress['total_days'],
            ] : null,
            'attendance' => $attendanceStats,
            'workout_stats' => $workoutStats,
            'recent_activities' => $recentActivities,
            'quick_stats' => [
                'total_checkins' => $user->attendanceLogs()->count(),
                'total_workouts' => $user->attendanceLogs()->count(), // Using attendance as workout count
                'current_streak' => $this->getCurrentStreak($user),
                'attendance_rate' => $attendanceStats['attendance_rate'],
            ]
        ]);
    }

    /**
     * Get attendance statistics
     */
    private function getAttendanceStats($user)
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        
        // Check-ins this month
        $checkinsThisMonth = $user->attendanceLogs()
            ->whereMonth('check_in', $currentMonth)
            ->whereYear('check_in', $currentYear)
            ->count();

        // Check-ins last month for comparison
        $lastMonth = Carbon::now()->subMonth();
        $checkinsLastMonth = $user->attendanceLogs()
            ->whereMonth('check_in', $lastMonth->month)
            ->whereYear('check_in', $lastMonth->year)
            ->count();

        // Calculate percentage change
        $percentageChange = 0;
        if ($checkinsLastMonth > 0) {
            $percentageChange = (($checkinsThisMonth - $checkinsLastMonth) / $checkinsLastMonth) * 100;
        } elseif ($checkinsThisMonth > 0) {
            $percentageChange = 100; // First time having check-ins
        }

        // Calculate attendance rate (based on possible days in month)
        $daysInMonth = Carbon::now()->daysInMonth;
        $daysPassed = Carbon::now()->day;
        $maxPossibleCheckins = $daysPassed; // Assuming one check-in per day max
        $attendanceRate = $maxPossibleCheckins > 0 ? round(($checkinsThisMonth / $maxPossibleCheckins) * 100) : 0;

        return [
            'checkins_this_month' => $checkinsThisMonth,
            'checkins_last_month' => $checkinsLastMonth,
            'percentage_change' => round($percentageChange, 1),
            'attendance_rate' => $attendanceRate,
            'trend' => $percentageChange >= 0 ? 'up' : 'down'
        ];
    }

    /**
     * Get workout statistics
     */
    private function getWorkoutStats($user)
    {
        // Total workouts (using attendance as workout count)
        $totalWorkouts = $user->attendanceLogs()->count();
        
        // Total workout time (in hours)
        $totalTime = $user->attendanceLogs()
            ->whereNotNull('check_out')
            ->get()
            ->sum(function ($log) {
                return $log->check_in->diffInHours($log->check_out);
            });

        // Progress calculation (simplified - could be based on goals)
        $progress = $this->calculateWorkoutProgress($user);

        return [
            'workouts_completed' => $totalWorkouts,
            'total_time_hours' => $totalTime,
            'progress_percentage' => $progress,
            'average_session_hours' => $totalWorkouts > 0 ? round($totalTime / $totalWorkouts, 1) : 0,
        ];
    }

    /**
     * Calculate workout progress (simplified)
     */
    private function calculateWorkoutProgress($user)
    {
        // This is a simplified progress calculation
        // In a real app, this would be based on user goals
        $currentMonthCheckins = $user->attendanceLogs()
            ->whereMonth('check_in', Carbon::now()->month)
            ->count();

        // Assuming a goal of 20 workouts per month
        $monthlyGoal = 20;
        $progress = min(100, ($currentMonthCheckins / $monthlyGoal) * 100);

        return round($progress);
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($user)
    {
        $activities = [];

        // Recent check-ins (last 5)
        $recentCheckins = $user->attendanceLogs()
            ->with('user')
            ->orderBy('check_in', 'desc')
            ->limit(5)
            ->get();

        foreach ($recentCheckins as $checkin) {
            $activities[] = [
                'type' => 'check_in',
                'title' => 'Check-in Confirmation',
                'message' => "You checked in at " . $checkin->check_in->format('g:i A'),
                'time' => $checkin->check_in->diffForHumans(),
                'exact_time' => $checkin->check_in->format('Y-m-d H:i:s'),
                'icon' => 'check-in',
                'color' => 'green',
                'priority' => 'normal'
            ];

            if ($checkin->check_out) {
                $activities[] = [
                    'type' => 'check_out',
                    'title' => 'Check-out Confirmation',
                    'message' => "You checked out at " . $checkin->check_out->format('g:i A'),
                    'time' => $checkin->check_out->diffForHumans(),
                    'exact_time' => $checkin->check_out->format('Y-m-d H:i:s'),
                    'icon' => 'check-out',
                    'color' => 'blue',
                    'priority' => 'normal'
                ];
            }
        }

        // Membership notifications
        $currentMembership = $user->currentMembership;
        if ($currentMembership) {
            $daysRemaining = $currentMembership->days_remaining;
            
            if ($daysRemaining <= 7 && $daysRemaining > 0) {
                $activities[] = [
                    'type' => 'membership_reminder',
                    'title' => 'Membership Renewal Reminder',
                    'message' => "Your membership expires in {$daysRemaining} days. Renew now to continue enjoying our facilities.",
                    'time' => '2 days ago', // Static for example
                    'exact_time' => now()->subDays(2)->format('Y-m-d H:i:s'),
                    'icon' => 'membership',
                    'color' => 'red',
                    'priority' => 'urgent'
                ];
            }

            // Add membership activation notification
            if ($currentMembership->created_at->diffInDays(now()) <= 1) {
                $activities[] = [
                    'type' => 'membership_activated',
                    'title' => 'Membership Activated',
                    'message' => "Your {$currentMembership->type} membership has been activated successfully!",
                    'time' => $currentMembership->created_at->diffForHumans(),
                    'exact_time' => $currentMembership->created_at->format('Y-m-d H:i:s'),
                    'icon' => 'membership',
                    'color' => 'green',
                    'priority' => 'normal'
                ];
            }
        }

        // Recent payments
        $recentPayments = $user->payments()
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();

        foreach ($recentPayments as $payment) {
            $activities[] = [
                'type' => 'payment',
                'title' => 'Payment Successful',
                'message' => "Payment of {$payment->formatted_amount} for {$payment->membership->type} membership completed.",
                'time' => $payment->created_at->diffForHumans(),
                'exact_time' => $payment->created_at->format('Y-m-d H:i:s'),
                'icon' => 'payment',
                'color' => 'green',
                'priority' => 'normal'
            ];
        }

        // Sort activities by exact_time descending and limit to 6
        usort($activities, function ($a, $b) {
            return strtotime($b['exact_time']) - strtotime($a['exact_time']);
        });

        return array_slice($activities, 0, 6);
    }

    /**
     * Get membership progress
     */
    private function getMembershipProgress($membership)
    {
        if (!$membership) {
            return [
                'percentage' => 0,
                'days_used' => 0,
                'total_days' => 0
            ];
        }

        $startDate = $membership->start_date;
        $endDate = $membership->end_date;
        $today = Carbon::now();

        $totalDays = $startDate->diffInDays($endDate);
        $daysUsed = $startDate->diffInDays($today);

        // Ensure we don't exceed total days
        $daysUsed = min($daysUsed, $totalDays);
        $percentage = $totalDays > 0 ? round(($daysUsed / $totalDays) * 100) : 0;

        return [
            'percentage' => $percentage,
            'days_used' => $daysUsed,
            'total_days' => $totalDays
        ];
    }

    /**
     * Get current check-in streak
     */
    private function getCurrentStreak($user)
    {
        $streak = 0;
        $currentDate = Carbon::now();
        
        // Check consecutive days with check-ins
        for ($i = 0; $i < 30; $i++) { // Check up to 30 days back
            $checkDate = $currentDate->copy()->subDays($i);
            
            $hasCheckin = $user->attendanceLogs()
                ->whereDate('check_in', $checkDate->format('Y-m-d'))
                ->exists();
                
            if ($hasCheckin) {
                $streak++;
            } else {
                break;
            }
        }
        
        return $streak;
    }

    /**
     * Renew membership
     */
    public function renewMembership(Request $request)
    {
        $user = $request->user();
        $currentMembership = $user->currentMembership;

        if (!$currentMembership) {
            return response()->json([
                'message' => 'No active membership found to renew'
            ], 404);
        }

        // Calculate new dates
        $newStartDate = $currentMembership->end_date->addDay();
        $newEndDate = Membership::calculateEndDate($currentMembership->type, $newStartDate);

        // Create new membership record
        $newMembership = Membership::create([
            'user_id' => $user->id,
            'type' => $currentMembership->type,
            'price' => $currentMembership->price,
            'start_date' => $newStartDate,
            'end_date' => $newEndDate,
            'status' => 'active'
        ]);

        // Update user's membership type
        $user->update([
            'membership_type' => $currentMembership->type
        ]);

        return response()->json([
            'message' => 'Membership renewed successfully',
            'membership' => [
                'type' => $newMembership->type,
                'start_date' => $newMembership->start_date->format('Y-m-d'),
                'end_date' => $newMembership->end_date->format('Y-m-d'),
                'days_remaining' => $newMembership->days_remaining
            ]
        ]);
    }

    /**
     * Get quick stats for dashboard cards
     */
    public function getQuickStats(Request $request)
    {
        $user = $request->user();
        
        $currentMembership = $user->currentMembership;
        $attendanceStats = $this->getAttendanceStats($user);
        $workoutStats = $this->getWorkoutStats($user);

        return response()->json([
            'membership_status' => $currentMembership ? $currentMembership->status : 'inactive',
            'membership_type' => $user->membership_type,
            'checkins_this_month' => $attendanceStats['checkins_this_month'],
            'attendance_trend' => $attendanceStats['trend'],
            'attendance_percentage_change' => $attendanceStats['percentage_change'],
            'workouts_completed' => $workoutStats['workouts_completed'],
            'total_workout_time' => $workoutStats['total_time_hours'],
            'workout_progress' => $workoutStats['progress_percentage'],
            'current_streak' => $this->getCurrentStreak($user)
        ]);
    }
}