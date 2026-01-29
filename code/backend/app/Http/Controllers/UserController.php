<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,petugas,owner',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_CREATED',
            'description' => "User {$validated['username']} ({$validated['role']}) created.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return $user;
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:admin,petugas,owner',
            'status' => 'sometimes|in:active,inactive', // Map to is_active boolean if needed
        ]);

        if (isset($validated['status'])) {
            $user->is_active = $validated['status'] === 'active';
        }
        
        $user->update($request->except('status')); // Update other fields

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_UPDATED',
            'description' => "User {$user->username} updated.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        $username = $user->username;
        $user->delete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_DELETED',
            'description' => "User {$username} deleted.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->noContent();
    }
}
