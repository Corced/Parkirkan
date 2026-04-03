<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\ParkingRate;
use App\Models\ParkingArea;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    public function index()
    {
        return Vehicle::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string',
            'vehicle_type' => 'required|string',
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:20',
        ]);

        // Find even if soft-deleted
        $vehicle = Vehicle::withTrashed()->where('license_plate', $request->license_plate)->first();

        if ($vehicle) {
            if ($vehicle->trashed()) {
                $vehicle->restore();
            }
            $vehicle->update($request->only(['vehicle_type', 'owner_name', 'owner_phone']));
        } else {
            $vehicle = Vehicle::create($request->all());
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'VEHICLE_CREATED',
            'description' => "Kendaraan {$vehicle->license_plate} didaftarkan manual.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json($vehicle, 201);
    }

    public function parked()
    {
        // Get vehicles that have an active transaction
        $activeTransactions = Transaction::with('vehicle', 'area', 'rate')
            ->where('status', 'active')
            ->get();
        
        return response()->json($activeTransactions);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'license_plate' => 'required|string',
            'vehicle_type' => 'required|string', // motor, mobil, truck
            'area_id' => 'required|exists:parking_areas,id',
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:20',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Find or Create Vehicle (including soft-deleted)
            $vehicle = Vehicle::withTrashed()->firstOrCreate(
                ['license_plate' => $validated['license_plate']],
                [
                    'vehicle_type' => $validated['vehicle_type'], 
                    'owner_name' => $validated['owner_name'] ?? null,
                    'owner_phone' => $validated['owner_phone'] ?? null,
                    'total_visits' => 0
                ]
            );

            // Restore if it was soft-deleted
            if ($vehicle->trashed()) {
                $vehicle->restore();
            }

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
                'entry_officer_id' => $request->user()->id, // Officer logged in
                'ticket_number' => 'T-' . time() . '-' . rand(100, 999),
                'check_in_time' => now(),
                'status' => 'active',
            ]);

            // Update Vehicle Stats
            $vehicle->increment('total_visits');
            $vehicle->update(['last_visit' => now()]);

            // Log Activity
            ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'VEHICLE_CHECK_IN',
                'description' => "Kendaraan {$vehicle->license_plate} masuk di area {$area->name}.",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

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
                ->lockForUpdate()
                ->firstOrFail();

            $checkOutTime = now();
            $checkInTime = Carbon::parse($transaction->check_in_time);
            
            $totalMinutes = $checkInTime->diffInMinutes($checkOutTime);
            
            // 1. Check Grace Period
            if ($totalMinutes <= $transaction->rate->grace_period_minutes) {
                $cost = 0;
                $durationHours = 0;
            } else {
                // 2. Standard Calculation with Initial Rate
                // All staying past grace period are charged at least 1 hour (initial_rate)
                $durationHours = max(1, (int) ceil($totalMinutes / 60));
                
                $rate = $transaction->rate;
                $cost = $rate->initial_rate; // Cost for 1st hour
                
                if ($durationHours > 1) {
                    // Hourly rate applies after the first hour
                    $cost += ($durationHours - 1) * $rate->hourly_rate;
                }

                // 3. Apply Daily Max Cap
                $dailyMax = $rate->daily_max_rate;
                if ($dailyMax > 0) {
                    $days = (int) floor($durationHours / 24);
                    $remainingHours = $durationHours % 24;
                    
                    // Simple cap logic: min of calculated cost vs daily caps
                    // More complex: (Full Days * Daily Max) + min(Remaining * Hourly, Daily Max)
                    $cappedCost = ($days * $dailyMax) + min($remainingHours * $rate->hourly_rate, $dailyMax);
                    
                    // If calculated cost is higher than capped cost, use capped
                    // Note: Initial rate complicates simple floor-based cap, but this is a standard compromise
                    $cost = min($cost, $cappedCost);
                }
            }

            $transaction->update([
                'check_out_time' => $checkOutTime,
                'duration_hours' => $durationHours,
                'total_cost' => $cost,
                'exit_officer_id' => auth()->id(), // Set exit officer
                'status' => 'completed',
                'payment_status' => 'paid'
            ]);

            // Decrement Area Occupancy
            $transaction->area->decrement('occupied_slots');

            // Log Activity
            ActivityLog::create([
                'user_id' => auth()->id(),
                'action' => 'VEHICLE_CHECK_OUT',
                'description' => "Kendaraan {$transaction->vehicle->license_plate} keluar. Biaya: Rp {$cost}.",
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent()
            ]);

            return response()->json($transaction);
        });
    }

    public function searchParked(Request $request)
    {
        $validated = $request->validate([
            'license_plate' => 'required|string',
        ]);

        $licensePlate = $validated['license_plate'];

        // Find the vehicle first
        $vehicle = Vehicle::where('license_plate', $licensePlate)->first();

        if (!$vehicle) {
            return response()->json(['message' => 'Kendaraan dengan plat tersebut belum pernah terdaftar'], 404);
        }

        // Find its latest transaction (active or not)
        $latestTransaction = Transaction::with('vehicle', 'area', 'rate')
            ->where('vehicle_id', $vehicle->id)
            ->latest()
            ->first();

        return response()->json([
            'vehicle' => $vehicle,
            'latest_transaction' => $latestTransaction,
            'is_currently_parked' => $latestTransaction && $latestTransaction->status === 'active'
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'vehicle_type' => 'sometimes|string',
            'owner_name' => 'nullable|string|max:255',
            'owner_phone' => 'nullable|string|max:20',
        ]);

        $vehicle->update($validated);

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'VEHICLE_UPDATED',
            'description' => "Data kendaraan {$vehicle->license_plate} diperbarui.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json($vehicle);
    }

    public function destroy(Request $request, Vehicle $vehicle)
    {
        // Check if vehicle has active transactions
        $activeTransaction = $vehicle->transactions()->where('status', 'active')->exists();

        if ($activeTransaction) {
            return response()->json([
                'message' => 'Kendaraan sedang parkir, tidak bisa dihapus.'
            ], 400);
        }

        $licensePlate = $vehicle->license_plate;
        $vehicle->delete();

        // Log Activity
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'VEHICLE_DELETED',
            'description' => "Data kendaraan {$licensePlate} dihapus.",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json(null, 204);
    }
}
