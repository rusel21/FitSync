<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    /**
     * Get all staff members
     */
    public function index()
    {
        $staff = Staff::all()->map(function ($staff) {
            return [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'address' => $staff->address,
                'picture' => $staff->picture_url,
                'created_at' => $staff->created_at->format('Y-m-d H:i:s')
            ];
        });

        return response()->json([
            'staff' => $staff
        ]);
    }

    /**
     * Get single staff member - handles both ID formats
     */
    public function show($identifier)
    {
        // Find by staff_id first, then by id as fallback
        $staff = Staff::where('staff_id', $identifier)
                     ->orWhere('id', $identifier)
                     ->firstOrFail();

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
     * Create new staff member
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:staffs,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:Staff,Manager',
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
            'message' => 'Staff member created successfully',
            'staff' => [
                'staff_id' => $staff->staff_id,
                'name' => $staff->name,
                'email' => $staff->email,
                'role' => $staff->role,
                'phone' => $staff->phone,
                'picture' => $staff->picture_url
            ]
        ], 201);
    }

    /**
     * Update staff member - handles both ID formats
     */
    public function update(Request $request, $identifier)
    {
        $staff = Staff::where('staff_id', $identifier)
                     ->orWhere('id', $identifier)
                     ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:staffs,email,' . $staff->id . ',id',
            'role' => 'sometimes|in:Staff,Manager',
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

        $updateData = $request->only(['name', 'email', 'role', 'phone', 'address']);

        // Handle picture upload
        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($staff->picture) {
                Storage::delete('public/' . $staff->picture);
            }
            
            $picturePath = $request->file('picture')->store('staff_pictures', 'public');
            $updateData['picture'] = $picturePath;
        }

        $staff->update($updateData);

        return response()->json([
            'message' => 'Staff member updated successfully',
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
     * Delete staff member - handles both ID formats
     */
    public function destroy($identifier)
    {
        $staff = Staff::where('staff_id', $identifier)
                     ->orWhere('id', $identifier)
                     ->firstOrFail();

        // Delete picture if exists
        if ($staff->picture) {
            Storage::delete('public/' . $staff->picture);
        }

        $staff->delete();

        return response()->json([
            'message' => 'Staff member deleted successfully'
        ]);
    }

    /**
     * Upload staff picture only - handles both ID formats
     */
    public function uploadPicture(Request $request, $identifier)
    {
        $staff = Staff::where('staff_id', $identifier)
                     ->orWhere('id', $identifier)
                     ->firstOrFail();

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

    /**
     * Get staff image by filename
     */
    public function getImage($filename)
    {
        $path = storage_path('app/public/staff_pictures/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path);
    }

    /**
     * Get staff statistics
     */
    public function getStats()
    {
        $totalStaff = Staff::count();
        $managers = Staff::where('role', 'Manager')->count();
        $regularStaff = Staff::where('role', 'Staff')->count();

        return response()->json([
            'stats' => [
                'total_staff' => $totalStaff,
                'managers' => $managers,
                'regular_staff' => $regularStaff,
                'manager_percentage' => $totalStaff > 0 ? round(($managers / $totalStaff) * 100) : 0
            ]
        ]);
    }
}