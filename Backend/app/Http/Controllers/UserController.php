<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserAttendanceLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class UserController extends Controller
{
    // ✅ Get all members
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // ✅ Get single member
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // ✅ Create new member
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'gender'   => 'required|string|in:male,female',
            'address'  => 'required|string|max:255',
            'contact'  => 'required|string|max:15',
            'membership_type' => 'required|string|in:Daily Plan,Semi-Monthly Plan,Monthly Plan',
            'picture'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // ✅ Handle picture upload
        $picturePath = null;
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('pictures', 'public');
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'gender'   => $request->gender,
            'address'  => $request->address,
            'contact'  => $request->contact,
            'membership_type' => $request->membership_type,
            'picture'  => $picturePath,
            'role'     => 'user', // fixed, not editable
        ]);

        return response()->json($user, 201);
    }

    // ✅ Update member
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'    => 'sometimes|string|max:255',
            'email'   => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'gender'  => 'sometimes|string|in:male,female',
            'address' => 'sometimes|string|max:255',
            'contact' => 'sometimes|string|max:15',
            'membership_type' => 'sometimes|string|in:Daily Plan,Semi-Monthly Plan,Monthly Plan',
            'picture'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // ✅ Handle picture upload (replace if new one is uploaded)
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('pictures', 'public');
            $request->merge(['picture' => $picturePath]);
        }

        // ✅ Exclude "role" from updates
        $data = $request->except(['role']);

        $user->update($data);

        return response()->json($user);
    }

    // ✅ Delete member
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Member deleted successfully']);
    }

    // ✅ NEW: Get current authenticated user profile
    public function getCurrentUser(Request $request)
    {
        return response()->json($request->user());
    }

    // ✅ NEW: Update current user profile
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'contact' => 'sometimes|string|max:15',
            'gender' => 'sometimes|string|in:male,female',
            'address' => 'sometimes|string|max:255',
            'picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Handle picture upload
        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($user->picture) {
                Storage::delete('public/' . $user->picture);
            }
            
            $picturePath = $request->file('picture')->store('pictures', 'public');
            $user->picture = $picturePath;
        }

        // Update other fields
        $user->update($request->only(['name', 'contact', 'gender', 'address']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // ✅ NEW: Get dashboard data for current user
    public function getDashboardData(Request $request)
    {
        $user = $request->user();
        
        // Get attendance stats for current month
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
        
        $attendanceCount = $user->attendanceLogs()
            ->whereMonth('check_in', $currentMonth)
            ->whereYear('check_in', $currentYear)
            ->count();

        // Get recent check-ins (last 5)
        $recentCheckins = $user->attendanceLogs()
            ->orderBy('check_in', 'desc')
            ->limit(5)
            ->get(['check_in', 'check_out']);

        // Calculate attendance rate (you can customize this logic)
        $totalPossibleDays = Carbon::now()->daysInMonth;
        $attendanceRate = $totalPossibleDays > 0 ? round(($attendanceCount / $totalPossibleDays) * 100) : 0;

        return response()->json([
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'membership_type' => $user->membership_type,
                'user_id' => $user->user_id,
            ],
            'attendance_count' => $attendanceCount,
            'recent_checkins' => $recentCheckins,
            'stats' => [
                'checkins_this_month' => $attendanceCount,
                'workouts_completed' => $attendanceCount, // Using attendance as workout count for now
                'attendance_rate' => $attendanceRate,
            ],
            'membership_status' => [
                'type' => $user->membership_type,
                'status' => 'active', // You can add expiration logic later
                'user_id' => $user->user_id
            ]
        ]);
    }

    // ✅ NEW: Upload profile picture only
    public function uploadProfilePicture(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'picture' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Delete old picture if exists
        if ($user->picture) {
            Storage::delete('public/' . $user->picture);
        }
        
        $picturePath = $request->file('picture')->store('pictures', 'public');
        $user->picture = $picturePath;
        $user->save();

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'picture_url' => Storage::url($picturePath),
            'user' => $user
        ]);
    }
}