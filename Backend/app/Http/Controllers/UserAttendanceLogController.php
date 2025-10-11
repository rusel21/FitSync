<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\UserAttendanceLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UserAttendanceLogController extends Controller
{
    // GET /api/attendance
    public function index()
{
    // 1️⃣ Query the user_attendance_logs table (aliased as "a")
    //    and join it with the users table (aliased as "u") using user_id
    $logs = DB::table('user_attendance_logs as a')
        ->leftJoin('users as u', 'a.user_id', '=', 'u.id')

        // 2️⃣ Select all attendance log fields (a.*)
        //    plus the user's name as "user_name"
        ->select('a.*', 
            'u.name as user_name',
            'u.user_id as user_code'//this will hold SYNC-0001
            )

        // 3️⃣ Sort by most recent check-in first
        ->orderBy('a.check_in', 'desc')

        // 4️⃣ Fetch all the results
        ->get();

    // 5️⃣ Return the data as JSON to your React frontend
    return response()->json($logs);
}


    // POST /api/attendance/checkin
  public function checkIn(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,user_id', // if using custom user_id like SYNC-0001
    ]);

    $user = \App\Models\User::where('user_id', $request->user_id)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $log = UserAttendanceLog::create([
        'user_id' => $user->id, // or $user->user_id depending on your FK setup
        'check_in' => now(),
    ]);

    return response()->json($log);
}

    // PUT /api/attendance/checkout/{id}
    public function checkOut($id)
    {
        $log = UserAttendanceLog::find($id);

        if (!$log) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        if ($log->check_out) {
            return response()->json(['message' => 'Already checked out'], 400);
        }

        $log->update(['check_out' => Carbon::now()]);

        return response()->json(['message' => 'Check-out successful', 'log' => $log]);
    }
}
