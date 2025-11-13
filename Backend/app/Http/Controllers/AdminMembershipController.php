<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MembershipPlan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminMembershipController extends Controller
{
    /**
     * Get all membership plans
     */
    public function getPlans(Request $request)
    {
        try {
            // Check if model and table exist
            if (!class_exists(MembershipPlan::class)) {
                return response()->json([
                    'error' => 'MembershipPlan model not found',
                    'message' => 'Please ensure the MembershipPlan model exists and is properly configured'
                ], 500);
            }

            if (!Schema::hasTable('membership_plans')) {
                return response()->json([
                    'error' => 'Membership plans table not found',
                    'message' => 'The membership_plans table does not exist in the database'
                ], 500);
            }

            $plans = MembershipPlan::withCount(['memberships as active_members_count' => function($query) {
                    $query->where('status', 'active')
                          ->where('end_date', '>=', now());
                }])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($plan) {
                    return [
                        'id' => $plan->id,
                        'name' => $plan->name,
                        'type' => $plan->type,
                        'duration' => $plan->duration,
                        'price' => (float) $plan->price,
                        'original_price' => (float) $plan->original_price,
                        'discount' => $plan->discount,
                        'perks' => $plan->perks ?: [],
                        'status' => $plan->status,
                        'members' => $plan->active_members_count,
                        'created_at' => $plan->created_at,
                        'updated_at' => $plan->updated_at
                    ];
                });

            return response()->json([
                'plans' => $plans,
                'total' => $plans->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching membership plans: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch membership plans',
                'message' => 'An error occurred while retrieving membership plans'
            ], 500);
        }
    }

    /**
     * Create a new membership plan
     */
    public function createPlan(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'type' => 'required|string|max:50',
                'duration' => 'required|string|max:50',
                'price' => 'required|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'discount' => 'nullable|string|max:10',
                'perks' => 'nullable|array',
                'status' => 'required|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if model and table exist
            if (!class_exists(MembershipPlan::class) || !Schema::hasTable('membership_plans')) {
                return response()->json([
                    'error' => 'Database configuration error',
                    'message' => 'MembershipPlan model or table not available'
                ], 500);
            }

            // Calculate discount if not provided
            $discount = $request->discount;
            if (!$discount && $request->original_price && $request->original_price > $request->price) {
                $discountPercentage = (($request->original_price - $request->price) / $request->original_price) * 100;
                $discount = round($discountPercentage) . '%';
            } else {
                $discount = $discount ?: '0%';
            }

            $planData = [
                'name' => $request->name,
                'type' => $request->type,
                'duration' => $request->duration,
                'price' => $request->price,
                'original_price' => $request->original_price ?: $request->price,
                'discount' => $discount,
                'perks' => $request->perks ?: [],
                'status' => $request->status,
            ];

            $plan = MembershipPlan::create($planData);
            
            // Reload with count
            $plan->loadCount(['memberships as active_members_count' => function($query) {
                $query->where('status', 'active')
                      ->where('end_date', '>=', now());
            }]);

            DB::commit();

            $responsePlan = [
                'id' => $plan->id,
                'name' => $plan->name,
                'type' => $plan->type,
                'duration' => $plan->duration,
                'price' => (float) $plan->price,
                'original_price' => (float) $plan->original_price,
                'discount' => $plan->discount,
                'perks' => $plan->perks ?: [],
                'status' => $plan->status,
                'members' => $plan->active_members_count
            ];

            return response()->json([
                'message' => 'Membership plan created successfully',
                'plan' => $responsePlan
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating membership plan: ' . $e->getMessage());
            
            $errorMessage = 'Failed to create membership plan';
            if ($e->getCode() == '23000') {
                $errorMessage = 'Database error - possible duplicate entry';
            }
            
            return response()->json([
                'error' => $errorMessage,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a membership plan
     */
    public function updatePlan(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:100',
                'type' => 'sometimes|string|max:50',
                'duration' => 'sometimes|string|max:50',
                'price' => 'sometimes|numeric|min:0',
                'original_price' => 'nullable|numeric|min:0',
                'discount' => 'nullable|string|max:10',
                'perks' => 'nullable|array',
                'status' => 'sometimes|in:active,inactive'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if model and table exist
            if (!class_exists(MembershipPlan::class) || !Schema::hasTable('membership_plans')) {
                return response()->json([
                    'error' => 'Database configuration error',
                    'message' => 'MembershipPlan model or table not available'
                ], 500);
            }

            $plan = MembershipPlan::find($id);
            
            if (!$plan) {
                return response()->json([
                    'error' => 'Membership plan not found'
                ], 404);
            }

            $updateData = [];
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('type')) $updateData['type'] = $request->type;
            if ($request->has('duration')) $updateData['duration'] = $request->duration;
            if ($request->has('price')) $updateData['price'] = $request->price;
            if ($request->has('original_price')) $updateData['original_price'] = $request->original_price;
            if ($request->has('discount')) $updateData['discount'] = $request->discount;
            if ($request->has('perks')) $updateData['perks'] = $request->perks;
            if ($request->has('status')) $updateData['status'] = $request->status;

            // Recalculate discount if price or original_price changed
            if (($request->has('price') || $request->has('original_price')) && !$request->has('discount')) {
                $currentPrice = $request->has('price') ? $request->price : $plan->price;
                $currentOriginalPrice = $request->has('original_price') ? $request->original_price : $plan->original_price;
                
                if ($currentOriginalPrice > $currentPrice) {
                    $discountPercentage = (($currentOriginalPrice - $currentPrice) / $currentOriginalPrice) * 100;
                    $updateData['discount'] = round($discountPercentage) . '%';
                } else {
                    $updateData['discount'] = '0%';
                }
            }

            $plan->update($updateData);
            
            // Reload with count
            $plan->loadCount(['memberships as active_members_count' => function($query) {
                $query->where('status', 'active')
                      ->where('end_date', '>=', now());
            }]);

            DB::commit();

            $responsePlan = [
                'id' => $plan->id,
                'name' => $plan->name,
                'type' => $plan->type,
                'duration' => $plan->duration,
                'price' => (float) $plan->price,
                'original_price' => (float) $plan->original_price,
                'discount' => $plan->discount,
                'perks' => $plan->perks ?: [],
                'status' => $plan->status,
                'members' => $plan->active_members_count
            ];

            return response()->json([
                'message' => 'Membership plan updated successfully',
                'plan' => $responsePlan
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating membership plan: ' . $e->getMessage());
            
            $errorMessage = 'Failed to update membership plan';
            if ($e->getCode() == '23000') {
                $errorMessage = 'Database error occurred';
            }
            
            return response()->json([
                'error' => $errorMessage,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a membership plan
     */
    public function deletePlan($id)
    {
        DB::beginTransaction();

        try {
            // Check if model and table exist
            if (!class_exists(MembershipPlan::class) || !Schema::hasTable('membership_plans')) {
                return response()->json([
                    'error' => 'Database configuration error',
                    'message' => 'MembershipPlan model or table not available'
                ], 500);
            }

            $plan = MembershipPlan::find($id);
            
            if (!$plan) {
                return response()->json([
                    'error' => 'Membership plan not found'
                ], 404);
            }

            // Check if plan has active memberships
            $activeMemberships = $plan->memberships()
                ->where('status', 'active')
                ->where('end_date', '>=', now())
                ->count();

            if ($activeMemberships > 0) {
                return response()->json([
                    'error' => 'Cannot delete plan',
                    'message' => 'This plan has active memberships. Please deactivate it instead or reassign members first.'
                ], 422);
            }

            $plan->delete();

            DB::commit();

            return response()->json([
                'message' => 'Membership plan deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting membership plan: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to delete membership plan',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available plan types
     */
    public function getPlanTypes()
    {
        try {
            $types = [
                'Daily Plan',
                'Semi-Monthly Plan', 
                'Monthly Plan',
                'Premium',
                'Quarterly',
                'Yearly'
            ];

            return response()->json([
                'types' => $types
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching plan types: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Failed to fetch plan types',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}