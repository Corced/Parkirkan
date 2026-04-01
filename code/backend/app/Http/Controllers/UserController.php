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
            'role' => 'required|in:superadmin,admin,petugas,owner',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $authUser = auth()->user();
        if ($authUser->role === 'admin' && in_array($validated['role'], ['admin', 'superadmin'])) {
            return response()->json(['message' => 'Admin cannot create a user with admin or superadmin role.'], 403);
        }

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => isset($validated['status']) ? ($validated['status'] === 'active') : true,
        ]);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_CREATED',
            'description' => "Pengguna {$validated['username']} ({$validated['role']}) ditambahkan.",
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
            'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|in:superadmin,admin,petugas,owner',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $authUser = auth()->user();
        if ($authUser->role === 'admin') {
            if ($user->role === 'superadmin' || ($user->role === 'admin' && $authUser->id !== $user->id)) {
                return response()->json(['message' => 'Admin cannot modify other admin or superadmin accounts.'], 403);
            }
            if (isset($validated['role']) && in_array($validated['role'], ['superadmin', 'admin']) && ($validated['role'] !== $user->role || $authUser->id !== $user->id)) {
                return response()->json(['message' => 'Admin cannot assign admin or superadmin roles.'], 403);
            }
        }

        // Handle status -> is_active mapping
        if (isset($validated['status'])) {
            $user->is_active = $validated['status'] === 'active';
            unset($validated['status']);
        }

        // Only hash and include password if it was actually provided and non-empty
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_UPDATED',
            'description' => "Data pengguna {$user->username} diperbarui.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json($user);
    }

    public function destroy(Request $request, User $user)
    {
        $authUser = auth()->user();
        if ($authUser->role === 'admin' && in_array($user->role, ['superadmin', 'admin'])) {
            return response()->json(['message' => 'Admin cannot delete an admin or superadmin account.'], 403);
        }

        $username = $user->username;
        $user->delete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'USER_DELETED',
            'description' => "Pengguna {$username} dihapus.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->noContent();
    }
}
