<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function start(Request $request)
    {
        $validated = $request->validate([
            'shift_type' => 'required|in:Pagi,Siang,Malam',
        ]);

        $user = $request->user();

        // Log Shift Start
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'SHIFT_START',
            'description' => "Shift {$validated['shift_type']} dimulai oleh {$user->name}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'message' => "Shift {$validated['shift_type']} berhasil dimulai.",
            'shift_type' => $validated['shift_type'],
            'started_at' => now()
        ]);
    }

    public function end(Request $request)
    {
        $validated = $request->validate([
            'shift_type' => 'required|in:Pagi,Siang,Malam',
            'transaction_count' => 'nullable|integer',
        ]);

        $user = $request->user();
        $count = $validated['transaction_count'] ?? 0;

        // Log Shift End
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'SHIFT_END',
            'description' => "Shift {$validated['shift_type']} berakhir. Total Transaksi: {$count}.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'message' => "Shift {$validated['shift_type']} berhasil diselesaikan.",
            'transaction_count' => $count
        ]);
    }
}
