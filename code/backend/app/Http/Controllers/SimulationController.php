<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Transaction;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SimulationController extends Controller
{
    public function simulateShift(Request $request)
    {
        $shift = $request->input('shift', 'Pagi'); // Pagi, Siang, Malam
        
        // 1. Log Shift Start
        ActivityLog::create([
            'user_id' => 1, // Assume Admin/System
            'action' => 'SHIFT_START',
            'description' => "Shift $shift dimulai.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // 2. Simulate Transactions (Check-ins)
        $vehicleTypes = ['motor', 'mobil', 'truck', 'bus'];
        $transactions = [];
        
        for ($i = 0; $i < 5; $i++) {
            $type = $vehicleTypes[array_rand($vehicleTypes)];
            $plate = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 2)) . ' ' . rand(1000, 9999) . ' ' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 3));
            
            // Create Vehicle if new (simplified)
            $vehicle = Vehicle::firstOrCreate(
                ['license_plate' => $plate],
                ['vehicle_type' => $type, 'total_visits' => 1]
            );

            $transactions[] = Transaction::create([
                'vehicle_id' => $vehicle->id,
                'area_id' => 1,
                'rate_id' => 1, // Mock
                'officer_id' => 1, // Mock
                'ticket_number' => 'T-' . time() . '-' . $i,
                'check_in_time' => now(),
                'status' => 'active',
                'payment_status' => 'pending'
            ]);
        }

        // 3. Log Shift End & Reminder
        ActivityLog::create([
            'user_id' => 1,
            'action' => 'SHIFT_END',
            'description' => "Shift $shift berakhir. Laporan telah digenerate.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        ActivityLog::create([
            'user_id' => 1,
            'action' => 'REMINDER',
            'description' => "Ping: Harap verifikasi kas untuk Shift $shift.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'message' => "Simulasi Shift $shift Berhasil",
            'generated_transactions' => count($transactions)
        ]);
    }
}
