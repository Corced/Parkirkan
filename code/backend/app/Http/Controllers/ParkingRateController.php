<?php

namespace App\Http\Controllers;

use App\Models\ParkingRate;
use Illuminate\Http\Request;

class ParkingRateController extends Controller
{
    public function index()
    {
        return ParkingRate::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_type' => 'required|string|unique:parking_rates',
            'hourly_rate' => 'required|integer',
            'daily_max_rate' => 'required|integer',
        ]);

        $rate = ParkingRate::create($validated);
        return response()->json($rate, 201);
    }

    public function update(Request $request, ParkingRate $rate)
    {
        $validated = $request->validate([
            'hourly_rate' => 'sometimes|integer',
            'daily_max_rate' => 'sometimes|integer',
        ]);

        $rate->update($validated);
        return response()->json($rate);
    }

    public function destroy(ParkingRate $rate)
    {
        $rate->delete();
        return response()->noContent();
    }
}
