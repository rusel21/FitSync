<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workout;
use App\Models\Membership;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StaffDashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $stats = [
            'total_members' => User::where('role', 'member')->count(),
            'active_members' => User::where('role', 'member')
                                ->whereHas('membership', function($query) {
                                    $query->where('end_date', '>', now());
                                })
                                ->count(),
            'today_attendance' => Attendance::whereDate('check_in', today())->count(),
            'pending_workouts' => Workout::where('status', 'pending')->count(),
        ];

        // Recent members
        $recentMembers = User::where('role', 'member')
                            ->with('membership')
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get();

        // Today's attendance
        $todayAttendance = Attendance::with('user')
                                    ->whereDate('check_in', today())
                                    ->orderBy('check_in', 'desc')
                                    ->get();

        // Recent workouts
        $recentWorkouts = Workout::with(['member', 'trainer'])
                                ->orderBy('created_at', 'desc')
                                ->take(5)
                                ->get();

        return view('staff.dashboard', compact('stats', 'recentMembers', 'todayAttendance', 'recentWorkouts'));
    }

    public function members()
    {
        $members = User::where('role', 'member')
                      ->with(['membership', 'attendances'])
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);

        return view('staff.members.index', compact('members'));
    }

    public function showMember($id)
    {
        $member = User::with(['membership', 'workouts', 'attendances' => function($query) {
            $query->orderBy('check_in', 'desc')->take(10);
        }])->findOrFail($id);

        return view('staff.members.show', compact('member'));
    }

    public function attendance()
    {
        $attendance = Attendance::with('user')
                              ->orderBy('check_in', 'desc')
                              ->paginate(15);

        return view('staff.attendance.index', compact('attendance'));
    }

    public function markAttendance(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if already checked in today
        $existingAttendance = Attendance::where('user_id', $request->user_id)
                                      ->whereDate('check_in', today())
                                      ->first();

        if ($existingAttendance) {
            return back()->with('error', 'Member already checked in today.');
        }

        Attendance::create([
            'user_id' => $request->user_id,
            'check_in' => now(),
        ]);

        return back()->with('success', 'Attendance marked successfully.');
    }

    public function workouts()
    {
        $workouts = Workout::with(['member', 'trainer'])
                          ->orderBy('created_at', 'desc')
                          ->paginate(10);

        return view('staff.workouts.index', compact('workouts'));
    }

    public function updateWorkoutStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,completed,cancelled',
        ]);

        $workout = Workout::findOrFail($id);
        $workout->update([
            'status' => $request->status,
            'updated_by' => auth()->id(),
        ]);

        return back()->with('success', 'Workout status updated successfully.');
    }
}