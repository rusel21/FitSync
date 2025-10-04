<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use Illuminate\Support\Facades\Storage;

class StaffController extends Controller
{
    // Display all staff
    public function index()
    {
        $staff = Staff::all();
        return response()->json($staff);
    }

    // Generate next staff_id
    private function generateStaffId()
    {
        $lastStaff = Staff::orderBy('staff_id', 'desc')->first();

        if (!$lastStaff) {
            return "Staff-0001";
        }

        $lastNumber = intval(substr($lastStaff->staff_id, 6));
        $newNumber = $lastNumber + 1;

        return "Staff-" . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    // Store a new staff record
    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email|unique:staffs,email',
            'phone'  => 'nullable|string|max:20',
        ]);

        $staffId = $this->generateStaffId();

        $staff = Staff::create([
            'staff_id' => $staffId,
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
        ]);

        return response()->json([
            'message' => 'Staff created successfully!',
            'data' => $staff
        ]);
    }

    // Show a specific staff
    public function show($staff_id)
    {
        $staff = Staff::where('staff_id', $staff_id)->firstOrFail();
        return response()->json($staff);
    }

    // Update staff info
    public function update(Request $request, $staff_id)
    {
        $staff = Staff::where('staff_id', $staff_id)->firstOrFail();

        $request->validate([
            'name'   => 'sometimes|string|max:255',
            'email'  => 'sometimes|email|unique:staffs,email,' . $staff->staff_id . ',staff_id',
            'phone'  => 'nullable|string|max:20',
        ]);

        $staff->update($request->all());

        return response()->json([
            'message' => 'Staff updated successfully!',
            'data' => $staff
        ]);
    }

    // Delete staff
    public function destroy($staff_id)
    {
        $staff = Staff::where('staff_id', $staff_id)->firstOrFail();

        if ($staff->picture && Storage::exists('public/staff/' . $staff->picture)) {
            Storage::delete('public/staff/' . $staff->picture);
        }

        $staff->delete();

        return response()->json(['message' => 'Staff deleted successfully!']);
    }

    // Upload or update staff picture
    public function uploadPicture(Request $request, $staff_id)
    {
        $request->validate([
            'picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $staff = Staff::where('staff_id', $staff_id)->firstOrFail();

        if ($request->hasFile('picture')) {
            if ($staff->picture && Storage::exists('public/staff/' . $staff->picture)) {
                Storage::delete('public/staff/' . $staff->picture);
            }

            $file = $request->file('picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/staff', $filename);

            $staff->picture = $filename;
            $staff->save();
        }

        return response()->json([
            'message' => 'Picture uploaded successfully!',
            'data' => $staff
        ]);
    }

    //Get image from storage/private/public/staff
    public function getImage($filename)
    {
            $path = storage_path('app/private/public/staff/'.$filename);

            if(!file_exists($path)){
                abort(404);
            }

            return response()->file($path);
    }
}
