<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\UserAttendanceLog;
use App\Models\Payment;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard data for admin using Eloquent models
     */
    public function getDashboardData(Request $request)
    {
        try {
            Log::info('AdminDashboardController: Starting dashboard data fetch');

            // Get basic stats using Eloquent models
            $totalMembers = User::count();
            Log::info("Total members: {$totalMembers}");

            // ✅ FIXED: Check active members based on active membership instead of user status
            $activeMembers = User::whereHas('currentMembership', function($query) {
                $query->where('status', 'active')
                      ->where('end_date', '>=', now());
            })->count();
            Log::info("Active members: {$activeMembers}");

            // Monthly revenue from payments using Eloquent
            $monthlyRevenue = Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('amount') ?? 0;
            Log::info("Monthly revenue: {$monthlyRevenue}");

            // Today's check-ins using Eloquent relationship
            $todayCheckins = UserAttendanceLog::whereDate('check_in', today())->count();
            Log::info("Today checkins: {$todayCheckins}");

            // Active membership plans count using Eloquent
            $activePlans = MembershipPlan::where('status', 'active')->count();
            Log::info("Active plans: {$activePlans}");

            // Pending renewals using Eloquent (memberships expiring in next 7 days)
            $pendingRenewals = Membership::where('end_date', '<=', now()->addDays(7))
                ->where('end_date', '>=', now())
                ->where('status', 'active')
                ->count();
            Log::info("Pending renewals: {$pendingRenewals}");

            // Calculate real growth percentages using Eloquent
            // Member growth (current month vs previous month)
            $currentMonthMembers = User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();
                
            $previousMonthMembers = User::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();
                
            $memberGrowth = $previousMonthMembers > 0 
                ? round((($currentMonthMembers - $previousMonthMembers) / $previousMonthMembers) * 100, 1)
                : 0;
            $memberGrowthFormatted = $memberGrowth >= 0 ? "+{$memberGrowth}%" : "{$memberGrowth}%";
            Log::info("Member growth: {$memberGrowthFormatted}");

            // Revenue growth (current month vs previous month)
            $previousMonthRevenue = Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->sum('amount') ?? 0;
                
            $revenueGrowth = $previousMonthRevenue > 0 
                ? round((($monthlyRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1)
                : ($monthlyRevenue > 0 ? 100 : 0);
            $revenueGrowthFormatted = $revenueGrowth >= 0 ? "+{$revenueGrowth}%" : "{$revenueGrowth}%";
            Log::info("Revenue growth: {$revenueGrowthFormatted}");

            // Check-in growth (today vs yesterday)
            $yesterdayCheckins = UserAttendanceLog::whereDate('check_in', today()->subDay())->count();
                
            $checkinGrowth = $yesterdayCheckins > 0 
                ? round((($todayCheckins - $yesterdayCheckins) / $yesterdayCheckins) * 100, 1)
                : ($todayCheckins > 0 ? 100 : 0);
            $checkinGrowthFormatted = $checkinGrowth >= 0 ? "+{$checkinGrowth}%" : "{$checkinGrowth}%";
            Log::info("Checkin growth: {$checkinGrowthFormatted}");

            // Plan growth (current active plans vs previous month)
            $previousMonthPlans = MembershipPlan::whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->count();
                
            $planGrowth = $activePlans - $previousMonthPlans;
            $planGrowthFormatted = $planGrowth >= 0 ? "+{$planGrowth}" : "{$planGrowth}";
            Log::info("Plan growth: {$planGrowthFormatted}");

            // Renewal change (current pending vs previous week)
            $previousWeekRenewals = Membership::where('end_date', '<=', now()->subWeek()->addDays(7))
                ->where('end_date', '>=', now()->subWeek())
                ->where('status', 'active')
                ->count();
                
            $renewalChange = $pendingRenewals - $previousWeekRenewals;
            $renewalChangeFormatted = $renewalChange >= 0 ? "+{$renewalChange}" : "{$renewalChange}";
            Log::info("Renewal change: {$renewalChangeFormatted}");

            // Pending renewals with member details using Eloquent relationships
            $pendingRenewalsList = Membership::with(['user'])
                ->where('end_date', '<=', now()->addDays(7))
                ->where('end_date', '>=', now())
                ->where('status', 'active')
                ->orderBy('end_date', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($membership) {
                    $status = 'Active';
                    if ($membership->end_date <= now()) {
                        $status = 'Expired';
                    } elseif ($membership->end_date <= now()->addDays(3)) {
                        $status = 'Expiring Soon';
                    }

                    return [
                        'name' => $membership->user->name ?? 'Unknown User',
                        'plan' => $membership->type,
                        'expiry_date' => $membership->end_date->format('Y-m-d'),
                        'status' => $status
                    ];
                });
            Log::info("Pending renewals list count: " . $pendingRenewalsList->count());

            // Recent activities from multiple sources using Eloquent
            $recentActivities = $this->getRecentActivities();

            // Calculate real quick stats using Eloquent
            $quickStats = $this->calculateQuickStats($monthlyRevenue, $currentMonthMembers, $previousMonthRevenue, $previousMonthMembers, $todayCheckins);

            Log::info('AdminDashboardController: Successfully fetched all data');

            return response()->json([
                'stats' => [
                    'totalMembers' => $totalMembers,
                    'activeMembers' => $activeMembers,
                    'monthlyRevenue' => (float)$monthlyRevenue,
                    'todayCheckins' => $todayCheckins,
                    'activePlans' => $activePlans,
                    'pendingRenewals' => $pendingRenewals,
                    'memberGrowth' => $memberGrowthFormatted,
                    'revenueGrowth' => $revenueGrowthFormatted,
                    'checkinGrowth' => $checkinGrowthFormatted,
                    'planGrowth' => $planGrowthFormatted,
                    'renewalChange' => $renewalChangeFormatted,
                ],
                'pendingRenewals' => $pendingRenewalsList,
                'recentActivities' => $recentActivities,
                'quickStats' => $quickStats
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard data error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Failed to load dashboard data',
                'message' => $e->getMessage(),
                'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Get recent activities from multiple sources
     */
    private function getRecentActivities()
    {
        $recentActivities = collect();

        try {
            // Get recent member registrations
            $recentRegistrations = User::where('created_at', '>=', now()->subDays(3))
                ->get()
                ->map(function ($user) {
                    return [
                        'action' => 'New member registration',
                        'user' => $user->name,
                        'time' => $user->created_at->diffForHumans(),
                        'created_at' => $user->created_at
                    ];
                });

            // Get recent payments with user relationship
            $recentPayments = Payment::with('user')
                ->where('created_at', '>=', now()->subDays(3))
                ->where('status', 'completed')
                ->get()
                ->map(function ($payment) {
                    return [
                        'action' => 'Payment received - ' . ($payment->membership_type ?? 'Membership'),
                        'user' => $payment->user->name ?? 'Unknown User',
                        'time' => $payment->created_at->diffForHumans(),
                        'created_at' => $payment->created_at
                    ];
                });

            // Get recent check-ins with user relationship
            $recentCheckins = UserAttendanceLog::with('user')
                ->where('check_in', '>=', now()->subDays(1))
                ->get()
                ->map(function ($attendance) {
                    return [
                        'action' => 'Gym check-in',
                        'user' => $attendance->user->name ?? 'Unknown User',
                        'time' => $attendance->check_in->diffForHumans(),
                        'created_at' => $attendance->check_in
                    ];
                });

            // Get membership activations/renewals
            $recentMemberships = Membership::with('user')
                ->where('created_at', '>=', now()->subDays(3))
                ->get()
                ->map(function ($membership) {
                    return [
                        'action' => 'Membership activated - ' . $membership->type,
                        'user' => $membership->user->name ?? 'Unknown User',
                        'time' => $membership->created_at->diffForHumans(),
                        'created_at' => $membership->created_at
                    ];
                });

            // Combine all activities and sort by date
            $recentActivities = $recentRegistrations
                ->merge($recentPayments)
                ->merge($recentCheckins)
                ->merge($recentMemberships)
                ->sortByDesc('created_at')
                ->take(4)
                ->values()
                ->map(function ($activity) {
                    return [
                        'action' => $activity['action'],
                        'user' => $activity['user'],
                        'time' => $activity['time']
                    ];
                });

            Log::info("Recent activities count: " . $recentActivities->count());

        } catch (\Exception $e) {
            Log::error('Error fetching recent activities: ' . $e->getMessage());
        }

        // If no recent activities, provide basic system activities
        if ($recentActivities->isEmpty()) {
            $recentActivities = collect([
                ['action' => 'System initialized', 'user' => 'System', 'time' => 'Just now'],
                ['action' => 'Admin login', 'user' => 'Administrator', 'time' => '5 minutes ago'],
            ]);
        }

        return $recentActivities;
    }

    /**
     * Calculate quick stats
     */
    private function calculateQuickStats($monthlyRevenue, $currentMonthMembers, $previousMonthRevenue, $previousMonthMembers, $todayCheckins)
    {
        try {
            // Monthly growth (overall business growth)
            $currentMonthTotal = $monthlyRevenue + ($currentMonthMembers * 100);
            $previousMonthTotal = $previousMonthRevenue + ($previousMonthMembers * 100);
            
            $monthlyGrowth = $previousMonthTotal > 0 
                ? round((($currentMonthTotal - $previousMonthTotal) / $previousMonthTotal) * 100, 1)
                : ($currentMonthTotal > 0 ? 100 : 0);
            $monthlyGrowthFormatted = $monthlyGrowth >= 0 ? "+{$monthlyGrowth}%" : "{$monthlyGrowth}%";

            // Equipment usage (based on check-in patterns during peak hours)
            $peakHoursCheckins = UserAttendanceLog::whereTime('check_in', '>=', '17:00:00')
                ->whereTime('check_in', '<=', '20:00:00')
                ->whereDate('check_in', today())
                ->count();
                
            $equipmentUsage = $todayCheckins > 0 
                ? round(($peakHoursCheckins / $todayCheckins) * 100, 0)
                : 0;
            $equipmentUsageFormatted = "{$equipmentUsage}%";

            return [
                'monthlyGrowth' => $monthlyGrowthFormatted,
                'equipmentUsage' => $equipmentUsageFormatted,
            ];

        } catch (\Exception $e) {
            Log::error('Error calculating quick stats: ' . $e->getMessage());
            
            return [
                'monthlyGrowth' => '+0%',
                'equipmentUsage' => '0%'
            ];
        }
    }

    /**
     * Simple fallback dashboard data for testing
     */
    public function getSimpleDashboardData(Request $request)
    {
        try {
            // Basic data without complex calculations
            $totalMembers = User::count();
            
            // ✅ FIXED: Active members based on membership status
            $activeMembers = User::whereHas('currentMembership', function($query) {
                $query->where('status', 'active')
                      ->where('end_date', '>=', now());
            })->count();
            
            $monthlyRevenue = Payment::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('amount') ?? 0;
            $todayCheckins = UserAttendanceLog::whereDate('check_in', today())->count();
            $activePlans = MembershipPlan::where('status', 'active')->count();

            return response()->json([
                'stats' => [
                    'totalMembers' => $totalMembers,
                    'activeMembers' => $activeMembers,
                    'monthlyRevenue' => (float)$monthlyRevenue,
                    'todayCheckins' => $todayCheckins,
                    'activePlans' => $activePlans,
                    'pendingRenewals' => 0,
                    'memberGrowth' => '+0%',
                    'revenueGrowth' => '+0%',
                    'checkinGrowth' => '+0%',
                    'planGrowth' => '+0',
                    'renewalChange' => '+0',
                ],
                'pendingRenewals' => [],
                'recentActivities' => [
                    ['action' => 'System initialized', 'user' => 'System', 'time' => 'Just now']
                ],
                'quickStats' => [
                    'monthlyGrowth' => '+0%',
                    'equipmentUsage' => '0%'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Simple dashboard error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to load simple dashboard data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}