<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\MembershipPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MembershipController extends Controller
{
    // Get current user's membership
    public function getCurrentMembership(Request $request)
    {
        $user = $request->user();
        
        $currentMembership = $user->currentMembership;
        
        if (!$currentMembership) {
            return response()->json([
                'message' => 'No active membership found',
                'has_membership' => false
            ], 200); // ✅ CHANGED: 404 → 200 (this is a successful request, just no data)
        }

        return response()->json([
            'has_membership' => true,
            'membership' => [
                'id' => $currentMembership->id,
                'type' => $currentMembership->type,
                'price' => (float) $currentMembership->price,
                'start_date' => $currentMembership->start_date->format('Y-m-d'),
                'end_date' => $currentMembership->end_date->format('Y-m-d'),
                'status' => $currentMembership->status,
                'days_remaining' => $currentMembership->days_remaining,
                'is_active' => $currentMembership->isActive(),
            ]
        ]);
    }

    // Get membership history for current user
    public function getMembershipHistory(Request $request)
    {
        $user = $request->user();
        
        $memberships = $user->memberships()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($membership) {
                return [
                    'id' => $membership->id,
                    'type' => $membership->type,
                    'price' => (float) $membership->price,
                    'start_date' => $membership->start_date->format('Y-m-d'),
                    'end_date' => $membership->end_date->format('Y-m-d'),
                    'status' => $membership->status,
                    'created_at' => $membership->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json([
            'memberships' => $memberships
        ]);
    }

    // Create or update membership
    public function updateMembership(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'type' => 'required|string|in:Daily Plan,Semi-Monthly Plan,Monthly Plan,Premium,Yearly,Quarterly',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        DB::beginTransaction();

        try {
            // Deactivate current active membership if exists
            $user->memberships()
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            // Calculate end date and get price from MembershipPlan
            $endDate = Membership::calculateEndDate($request->type, $request->start_date);
            $price = Membership::getPrice($request->type);

            // Create new membership
            $membership = Membership::create([
                'user_id' => $user->id,
                'type' => $request->type,
                'price' => $price,
                'start_date' => $request->start_date,
                'end_date' => $endDate,
                'status' => 'active',
            ]);

            // Update user's membership_type
            $user->update([
                'membership_type' => $request->type
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Membership updated successfully',
                'membership' => [
                    'id' => $membership->id,
                    'type' => $membership->type,
                    'price' => (float) $membership->price,
                    'start_date' => $membership->start_date->format('Y-m-d'),
                    'end_date' => $membership->end_date->format('Y-m-d'),
                    'status' => $membership->status,
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating membership: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update membership',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Get available membership plans - USES SEEDED DATA FROM MEMBERSHIP PLAN TABLE
    public function getMembershipPlans()
    {
        try {
            // Get active plans from database - these are your seeded plans
            $plans = MembershipPlan::active()
                ->orderBy('price', 'asc')
                ->get()
                ->map(function ($plan) {
                    return [
                        'type' => $plan->type,
                        'name' => $plan->name,
                        'price' => (float) $plan->price,
                        'original_price' => (float) $plan->original_price,
                        'discount' => $plan->discount,
                        'duration' => $plan->duration,
                        'billing_cycle' => $this->getBillingCycle($plan->type),
                        'features' => $plan->perks ?: [],
                        'is_popular' => $plan->type === 'Monthly Plan', // Mark Monthly as popular
                    ];
                })->toArray();

            return response()->json([
                'plans' => $plans
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching membership plans: ' . $e->getMessage());
            
            // Fallback to your actual seeded data structure
            return response()->json([
                'plans' => [
                    [
                        'type' => 'Daily Plan',
                        'name' => 'Daily Pass',
                        'price' => 50.00,
                        'original_price' => 50.00,
                        'discount' => '0%',
                        'duration' => '1 Day',
                        'billing_cycle' => 'daily',
                        'features' => [
                            'Single day access',
                            'Basic equipment usage',
                            'Locker access',
                            'Shower facilities'
                        ],
                        'is_popular' => false
                    ],
                    [
                        'type' => 'Semi-Monthly Plan',
                        'name' => 'Semi-Monthly Plan',
                        'price' => 350.00,
                        'original_price' => 400.00,
                        'discount' => '12%',
                        'duration' => '15 Days',
                        'billing_cycle' => 'semi-monthly',
                        'features' => [
                            '15 days unlimited access',
                            'All equipment usage',
                            'Locker access',
                            'Shower facilities',
                            'Free towel service',
                            'Basic fitness assessment'
                        ],
                        'is_popular' => false
                    ],
                    [
                        'type' => 'Monthly Plan',
                        'name' => 'Monthly Membership',
                        'price' => 500.00,
                        'original_price' => 600.00,
                        'discount' => '17%',
                        'duration' => '30 Days',
                        'billing_cycle' => 'monthly',
                        'features' => [
                            '30 days unlimited access',
                            'All equipment usage',
                            'Locker access',
                            'Shower facilities',
                            'Free towel service',
                            'Basic fitness assessment',
                            '2 free personal training sessions',
                            'Nutrition consultation'
                        ],
                        'is_popular' => true
                    ]
                ]
            ]);
        }
    }

    // Cancel current membership
    public function cancelMembership(Request $request)
    {
        $user = $request->user();
        
        $currentMembership = $user->currentMembership;
        
        if (!$currentMembership) {
            return response()->json([
                'message' => 'No active membership found'
            ], 200); // ✅ CHANGED: 404 → 200 (successful request, just no membership to cancel)
        }

        DB::beginTransaction();

        try {
            $currentMembership->update([
                'status' => 'cancelled'
            ]);

            $user->update([
                'membership_type' => null
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Membership cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cancelling membership: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to cancel membership',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get billing cycle based on plan type
     */
    private function getBillingCycle($type)
    {
        return match($type) {
            'Daily Plan' => 'daily',
            'Semi-Monthly Plan' => 'semi-monthly',
            'Monthly Plan' => 'monthly',
            'Premium' => 'monthly',
            'Quarterly' => 'quarterly',
            'Yearly' => 'yearly',
            default => 'monthly',
        };
    }
}