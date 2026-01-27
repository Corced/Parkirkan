<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\ParkingRate;
use App\Models\ParkingArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VehicleController extends Controller
{
    public function index()
    {
        return Vehicle::all();
    }

    public function parked()
    {
        // Get vehicles that have an active transaction
        $activeTransactions = Transaction::with('vehicle', 'area')
            ->where('status', 'active')
            ->get();
        
        return response()->json($activeTransactions);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'license_plate' => 'required|string|uppercase',
            'vehicle_type' => 'required|string', // motor, mobil, truck
            'area_id' => 'required|exists:parking_areas,id',
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:20',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Find or Create Vehicle
            $vehicle = Vehicle::firstOrCreate(
                ['license_plate' => $validated['license_plate']],
                [
                    'vehicle_type' => $validated['vehicle_type'], 
                    'owner_name' => $validated['owner_name'] ?? null,
                    'owner_phone' => $validated['owner_phone'] ?? null,
                    'total_visits' => 0
                ]
            );

            // If vehicle exists, update owner info if provided
            if (!$vehicle->wasRecentlyCreated) {
                if (isset($validated['owner_name'])) $vehicle->owner_name = $validated['owner_name'];
                if (isset($validated['owner_phone'])) $vehicle->owner_phone = $validated['owner_phone'];
                $vehicle->save();
            }

            // Check if already parked
            $existingTransaction = Transaction::where('vehicle_id', $vehicle->id)
                ->where('status', 'active')
                ->first();

            if ($existingTransaction) {
                return response()->json(['message' => 'Vehicle is already parked'], 400);
            }

            // Get Rate ID (assuming simplified logic: 1 rate per type)
            $rate = ParkingRate::where('vehicle_type', $validated['vehicle_type'])->first();
            if (!$rate) return response()->json(['message' => 'Rate not found for this vehicle type'], 400);

            // Update Area Occupancy
            $area = ParkingArea::lockForUpdate()->find($validated['area_id']);
            if ($area->occupied_slots >= $area->total_capacity) {
                return response()->json(['message' => 'Parking area is full'], 400);
            }
            $area->increment('occupied_slots');

            // Create Transaction
            $transaction = Transaction::create([
                'vehicle_id' => $vehicle->id,
                'area_id' => $area->id,
                'rate_id' => $rate->id,
                'officer_id' => $request->user()->id, // Officer logged in
                'ticket_number' => 'T-' . time() . '-' . rand(100, 999),
                'check_in_time' => now(),
                'status' => 'active',
            ]);

            // Update Vehicle Stats
            $vehicle->increment('total_visits');
            $vehicle->update(['last_visit' => now()]);

            return response()->json($transaction, 201);
        });
    }

    public function checkOut(Request $request)
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string|exists:transactions,ticket_number',
        ]);

        return DB::transaction(function () use ($validated) {
            $transaction = Transaction::where('ticket_number', $validated['ticket_number'])
                ->where('status', 'active')
                ->with('rate', 'area')
                ->firstOrFail();

            $checkOutTime = now();
            $checkInTime = Carbon::parse($transaction->check_in_time);
            
            // Calculate Duration in Minutes first for "Fair and Square" logic
            $totalMinutes = $checkInTime->diffInMinutes($checkOutTime);
            
            // Round up to the nearest hour (any fraction of an hour counts as a full hour)
            // Minimum 1 hour
            $durationHours = max(1, (int) ceil($totalMinutes / 60));
            
            // Calculate Cost with Daily Max Cap
            $rate = $transaction->rate;
            $dailyMax = $rate->daily_max_rate;
            $hourlyRate = $rate->hourly_rate;

            $days = (int) floor($durationHours / 24);
            $remainingHours = $durationHours % 24;

            if ($dailyMax > 0) {
                // (Full Days * Daily Max) + min(Remaining Hours * Hourly Rate, Daily Max)
                $cost = ($days * $dailyMax) + min($remainingHours * $hourlyRate, $dailyMax);
            } else {
                $cost = $durationHours * $hourlyRate;
            }

            $transaction->update([
                'check_out_time' => $checkOutTime,
                'duration_hours' => $durationHours,
                'total_cost' => $cost,
                'status' => 'completed',
                'payment_status' => 'paid'
            ]);

            // Decrement Area Occupancy
            $transaction->area->decrement('occupied_slots');

            return response()->json($transaction);
        });
    }

    public function searchParked(Request $request)
    {
        $validated = $request->validate([
            'license_plate' => 'required|string',
        ]);

        $licensePlate = strtoupper($validated['license_plate']);

        // Find the vehicle first
        $vehicle = Vehicle::where('license_plate', $licensePlate)->first();

        if (!$vehicle) {
            return response()->json(['message' => 'Kendaraan dengan plat tersebut belum pernah terdaftar'], 404);
        }

        // Find its latest transaction (active or not)
        $latestTransaction = Transaction::with('area', 'rate')
            ->where('vehicle_id', $vehicle->id)
            ->latest()
            ->first();

        return response()->json([
            'vehicle' => $vehicle,
            'latest_transaction' => $latestTransaction,
            'is_currently_parked' => $latestTransaction && $latestTransaction->status === 'active'
        ]);
    }
}
