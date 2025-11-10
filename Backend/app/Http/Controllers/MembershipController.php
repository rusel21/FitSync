<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Membership;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            ], 404);
        }

        return response()->json([
            'has_membership' => true,
            'membership' => [
                'id' => $currentMembership->id,
                'type' => $currentMembership->type,
                'price' => $currentMembership->price,
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
                    'price' => $membership->price,
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

        DB::transaction(function () use ($user, $request) {
            // Deactivate current active membership if exists
            $user->memberships()
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            // Calculate end date and price
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
        });

        return response()->json([
            'message' => 'Membership updated successfully',
            'membership' => $user->currentMembership
        ]);
    }

    // Get available membership plans
    public function getMembershipPlans()
    {
        $plans = [
            [
                'type' => 'Premium',
                'price' => 99.00,
                'billing_cycle' => 'monthly',
                'features' => ['All gym access', 'Personal trainer', 'Nutrition planning', 'Priority booking']
            ],
            [
                'type' => 'Yearly',
                'price' => 79.00,
                'billing_cycle' => 'monthly',
                'features' => ['All gym access', 'Group classes', 'Fitness assessment']
            ],
            [
                'type' => 'Quarterly',
                'price' => 89.00,
                'billing_cycle' => 'monthly',
                'features' => ['All gym access', 'Group classes']
            ],
            [
                'type' => 'Monthly',
                'price' => 99.00,
                'billing_cycle' => 'monthly',
                'features' => ['All gym access', 'Basic equipment']
            ],
            [
                'type' => 'Semi-Monthly Plan',
                'price' => 45.00,
                'billing_cycle' => 'semi-monthly',
                'features' => ['Basic gym access']
            ],
            [
                'type' => 'Daily Plan',
                'price' => 10.00,
                'billing_cycle' => 'daily',
                'features' => ['Single day access']
            ]
        ];

        return response()->json([
            'plans' => $plans
        ]);
    }

    // Cancel current membership
    public function cancelMembership(Request $request)
    {
        $user = $request->user();
        
        $currentMembership = $user->currentMembership;
        
        if (!$currentMembership) {
            return response()->json([
                'message' => 'No active membership found'
            ], 404);
        }

        $currentMembership->update([
            'status' => 'cancelled'
        ]);

        $user->update([
            'membership_type' => null
        ]);

        return response()->json([
            'message' => 'Membership cancelled successfully'
        ]);
    }
}