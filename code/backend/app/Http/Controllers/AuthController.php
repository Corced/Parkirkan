<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required',
        ]);

        $loginField = filter_var($request->login_id, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $loginField => $request->login_id,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            if (!$user->is_active) {
                Auth::logout();
                return response()->json(['message' => 'Account is inactive'], 403);
            }


            $token = $user->createToken('auth_token')->plainTextToken;

            // Log Activity
            \App\Models\ActivityLog::create([
                'user_id' => $user->id,
                'action' => 'LOGIN',
                'description' => "User {$user->username} logged in.",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'Invalid login details'], 401);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log Activity
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'LOGOUT',
            'description' => "User {$user->username} logged out.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        $user->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return $request->user();
    }
}
