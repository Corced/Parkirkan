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
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Find or Create Vehicle
            $vehicle = Vehicle::firstOrCreate(
                ['license_plate' => $validated['license_plate']],
                ['vehicle_type' => $validated['vehicle_type'], 'total_visits' => 0]
            );

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
            $durationHours = $checkInTime->diffInHours($checkOutTime) ?: 1; // Minimum 1 hour
            
            // Calculate Cost
            $rate = $transaction->rate;
            $cost = $rate->hourly_rate * $durationHours; // Simplified logic, can be more complex
            // Apply Max Daily if needed
            if ($durationHours > 24 && $rate->daily_max_rate) {
                // Simplified daily calc logic placeholder
            }

            $transaction->update([
                'check_out_time' => $checkOutTime,
                'duration_hours' => $durationHours,
                'total_cost' => $cost,
                'status' => 'completed',
                'payment_status' => 'paid' // Assuming cash/immediate payment
            ]);

            // Decrement Area Occupancy
            $transaction->area->decrement('occupied_slots');

            return response()->json($transaction);
        });
    }
}
