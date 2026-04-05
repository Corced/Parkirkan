<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Transaction;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ParkingArea;

class SimulationController extends Controller
{
    private function syncAllOccupancy()
    {
        // Re-sync all occupied_slots based on actual active transactions
        $areas = ParkingArea::all();
        foreach ($areas as $area) {
            $actualCount = Transaction::where('area_id', $area->id)
                ->where('status', 'active')
                ->count();
            $area->update(['occupied_slots' => $actualCount]);
        }
    }

    public function simulateShift(Request $request)
    {
        $role = $request->input('role', 'petugas');
        $scenario = $request->input('scenario', 'morning');
        
        // Sync first to repair any negative/incorrect numbers
        $this->syncAllOccupancy();
        
        // Find a user with the requested role
        $officer = User::where('role', $role)->inRandomOrder()->first() ?? User::find(1);
        
        // Determine check-in time based on scenario
        $checkInTime = now();
        switch ($scenario) {
            case 'morning':
                $checkInTime = now()->startOfDay()->addHours(8)->addMinutes(rand(0, 59));
                break;
            case 'noon':
                $checkInTime = now()->startOfDay()->addHours(12)->addMinutes(rand(0, 59));
                break;
            case 'evening':
                $checkInTime = now()->startOfDay()->addHours(17)->addMinutes(rand(0, 59));
                break;
            case 'night':
                $checkInTime = now()->startOfDay()->addHours(21)->addMinutes(rand(0, 59));
                break;
            case 'overnight':
                $checkInTime = now()->subDay()->startOfDay()->addHours(19)->addMinutes(rand(0, 59));
                break;
            case 'yesterday':
                $checkInTime = now()->subDay()->startOfDay()->addHours(10)->addMinutes(rand(0, 59));
                break;
        }

        // 1. Log Shift Start
        ActivityLog::create([
            'user_id' => $officer->id,
            'action' => 'SHIFT_START',
            'description' => "Shift simulasi ($scenario) dimulai oleh {$officer->name} ($role).",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        // 2. Simulate Transactions (Check-ins)
        $vehicleTypes = ['Motor', 'Mobil', 'Truk Logistik', 'Motor Gede', 'Mobil Sports'];
        $transactions = [];
        
        // Map types to rate IDs (matching ParkingRateSeeder ids 1-5)
        $rateMap = [
            'Motor' => 1,
            'Mobil' => 2,
            'Truk Logistik' => 3,
            'Motor Gede' => 4,
            'Mobil Sports' => 5
        ];

        // Map types to Area IDs (matching ParkingAreaSeeder)
        $areaMap = [
            'Motor' => 1,
            'Mobil' => 2,
            'Truk Logistik' => 3,
            'Mobil Sports' => 4,
            'Motor Gede' => 5
        ];
        
        for ($i = 0; $i < 5; $i++) {
            $type = $vehicleTypes[array_rand($vehicleTypes)];
            $plate = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 2)) . ' ' . rand(1000, 9999) . ' ' . strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 3));
            
            $vehicle = Vehicle::firstOrCreate(
                ['license_plate' => $plate],
                ['vehicle_type' => $type, 'total_visits' => rand(1, 10)]
            );

            $areaId = $areaMap[$type] ?? 1;
            
            // Increment occupied_slots in ParkingArea
            $area = ParkingArea::find($areaId);
            if ($area && $area->occupied_slots < $area->total_capacity) {
                $area->increment('occupied_slots');
            }

            $transactions[] = Transaction::create([
                'vehicle_id' => $vehicle->id,
                'area_id' => $areaId,
                'rate_id' => $rateMap[$type] ?? 1,
                'entry_officer_id' => $officer->id,
                'ticket_number' => 'T-' . time() . '-' . $i,
                'check_in_time' => $checkInTime->copy()->addMinutes($i * 10), // Space out entries
                'status' => 'active',
                'payment_status' => 'pending'
            ]);
        }

        // 3. Log Shift End & Reminder
        ActivityLog::create([
            'user_id' => $officer->id,
            'action' => 'SHIFT_END',
            'description' => "Shift simulasi ($scenario) berakhir. 5 Transaksi aktif digenerate.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json([
            'message' => "Simulasi Role $role ($scenario) Berhasil",
            'generated_transactions' => count($transactions)
        ]);
    }
}
