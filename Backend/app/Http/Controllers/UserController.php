<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
}
