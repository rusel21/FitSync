<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class StaffAuthController extends Controller
{
    /**
     * Staff registration (Manager only)
     */
    public function register(Request $request)
    {
 // Check if the current user is an admin
        $currentStaff = $request->user();
        if (!$currentStaff || $currentStaff->role !== 'Admin') {
            return response()->json([
                'message' => 'Unauthorized. Only administrators can register new staff.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:staffs,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:Staff,Admin', // Updated roles
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $staffData = $request->only(['name', 'email', 'role', 'phone', 'address']);
        $staffData['password'] = Hash::make($request->password);

        // Handle picture upload
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('staff_pictures', 'public');
            $staffData['picture'] = $picturePath;
        }

        $staff = Staff::create($staffData);

        return response()->json([
            'message' => 'Staff member registered successfully',
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'picture' => $staff->picture_url,
                'created_at' => $staff->created_at->format('Y-m-d H:i:s')
            ]
        ], 201);
    }

    /**
     * Staff login
     */
    public function login(Request $request)
    {
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

        $staff = Staff::where('email', $request->email)->first();

        if (!$staff || !Hash::check($request->password, $staff->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $staff->createToken('staff_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'picture' => $staff->picture_url
            ]
        ]);
    }

    /**
     * Staff logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current staff profile
     */
    public function getProfile(Request $request)
    {
        $staff = $request->user();
        
        return response()->json([
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'address' => $staff->address,
                'picture' => $staff->picture_url,
                'created_at' => $staff->created_at->format('Y-m-d H:i:s')
            ]
        ]);
    }

    /**
     * Update staff profile
     */
    public function updateProfile(Request $request)
    {
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
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'address' => $staff->address,
                'picture' => $staff->picture_url
            ]
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
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
    }

    /**
     * Upload profile picture
     */
    public function uploadPicture(Request $request)
    {
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
            'picture_url' => $staff->picture_url
        ]);
    }
}