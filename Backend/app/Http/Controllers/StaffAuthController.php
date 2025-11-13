<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class StaffAuthController extends Controller
{
    /**
     * Build safe staff response data
     */
    private function buildStaffResponse(Staff $staff)
    {
        $hasStaffId = Schema::hasColumn('staffs', 'staff_id');
        
        return [
            'id' => $staff->id,
            'staff_id' => $hasStaffId ? $staff->staff_id : 'STAFF-' . $staff->id,
            'name' => $staff->name,
            'email' => $staff->email,
            'role' => $staff->role,
            'phone' => $staff->phone,
            'address' => $staff->address,
            'picture' => $staff->picture_url,
            'created_at' => $staff->created_at ? $staff->created_at->format('Y-m-d H:i:s') : null,
            'is_admin' => $staff->role === 'Admin'
        ];
    }

    /**
     * Staff registration (Admin only)
     */
    public function register(Request $request)
    {
        Log::info('=== STAFF REGISTRATION START ===');
        
        // Check if the current user is an admin
        $currentStaff = $request->user();
        Log::info('Current staff:', [$currentStaff ? $currentStaff->toArray() : 'No user']);
        
        if (!$currentStaff || $currentStaff->role !== 'Admin') {
            Log::warning('Unauthorized registration attempt');
            return response()->json([
                'message' => 'Unauthorized. Only administrators can register new staff.'
            ], 403);
        }

        Log::info('Registration request data:', $request->except(['password', 'password_confirmation']));

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:staffs,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:Staff,Admin',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            Log::info('Starting staff creation...');
            
            $staffData = $request->only(['name', 'email', 'role', 'phone', 'address']);
            $staffData['password'] = Hash::make($request->password);

            // Handle picture upload
            if ($request->hasFile('picture')) {
                Log::info('Processing picture upload');
                $picturePath = $request->file('picture')->store('staff_pictures', 'public');
                $staffData['picture'] = $picturePath;
            }

            Log::info('Staff data prepared:', $staffData);

            // Create staff member
            $staff = Staff::create($staffData);
            Log::info('Staff created successfully', ['staff_id' => $staff->id]);

            // Refresh to get auto-generated fields
            $staff->refresh();
            Log::info('Staff after refresh:', $staff->toArray());

            Log::info('Registration successful');

            return response()->json([
                'message' => 'Staff member registered successfully',
                'staff' => $this->buildStaffResponse($staff)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['password', 'password_confirmation'])
            ]);
            
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
                'debug' => env('APP_DEBUG') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Staff login
     */
    public function login(Request $request)
    {
        Log::info('Staff login attempt', ['email' => $request->email]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $staff = Staff::where('email', $request->email)->first();

            if (!$staff) {
                Log::warning('Login failed: Staff not found', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!Hash::check($request->password, $staff->password)) {
                Log::warning('Login failed: Invalid password', ['email' => $request->email]);
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $token = $staff->createToken('staff_token')->plainTextToken;
            Log::info('Login successful', ['staff_id' => $staff->id, 'email' => $staff->email]);

            return response()->json([
                'token' => $token,
                'token_type' => 'Bearer',
                'staff' => $this->buildStaffResponse($staff)
            ]);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Login failed'
            ], 500);
        }
    }

    /**
     * Staff logout
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            Log::info('Staff logout successful');
            
            return response()->json([
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Logout failed'
            ], 500);
        }
    }

    /**
     * Get current staff profile
     */
    public function getProfile(Request $request)
    {
        try {
            $staff = $request->user();
            
            if (!$staff) {
                return response()->json([
                    'message' => 'Staff not found'
                ], 404);
            }

            return response()->json([
                'staff' => $this->buildStaffResponse($staff)
            ]);

        } catch (\Exception $e) {
            Log::error('Get profile error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to get profile'
            ], 500);
        }
    }

    /**
     * Update staff profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $staff = $request->user();

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:100',
                'phone' => 'sometimes|string|max:20',
                'address' => 'sometimes|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $staff->update($request->only(['name', 'phone', 'address']));

            return response()->json([
                'message' => 'Profile updated successfully',
                'staff' => $this->buildStaffResponse($staff)
            ]);

        } catch (\Exception $e) {
            Log::error('Update profile error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Profile update failed'
            ], 500);
        }
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6|confirmed'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $staff = $request->user();

            if (!Hash::check($request->current_password, $staff->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            $staff->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'message' => 'Password changed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Change password error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Password change failed'
            ], 500);
        }
    }

    /**
     * Upload profile picture
     */
    public function uploadPicture(Request $request)
    {
        try {
            $staff = $request->user();

            $validator = Validator::make($request->all(), [
                'picture' => 'required|image|mimes:jpg,jpeg,png|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Delete old picture if exists
            if ($staff->picture) {
                Storage::delete('public/' . $staff->picture);
            }

            $picturePath = $request->file('picture')->store('staff_pictures', 'public');
            $staff->picture = $picturePath;
            $staff->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'picture_url' => $staff->picture_url ?? null,
                'staff' => $this->buildStaffResponse($staff)
            ]);

        } catch (\Exception $e) {
            Log::error('Upload picture error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Picture upload failed'
            ], 500);
        }
    }

    /**
     * Debug route to check database and model
     */
    public function debug(Request $request)
    {
        Log::info('=== DEBUG ROUTE CALLED ===');
        
        try {
            // Check database connection
            $staffCount = Staff::count();
            $allStaff = Staff::all()->toArray();
            
            // Check table structure
            $columns = \Illuminate\Support\Facades\Schema::getColumnListing('staffs');
            
            return response()->json([
                'database_connected' => true,
                'staff_count' => $staffCount,
                'staff_records' => $allStaff,
                'table_columns' => $columns,
                'has_staff_id_column' => in_array('staff_id', $columns),
                'has_picture_column' => in_array('picture', $columns),
                'sample_staff_response' => $staffCount > 0 ? $this->buildStaffResponse(Staff::first()) : null
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}