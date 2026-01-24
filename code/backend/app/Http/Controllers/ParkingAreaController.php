<?php

namespace App\Http\Controllers;

use App\Models\ParkingArea;
use Illuminate\Http\Request;

class ParkingAreaController extends Controller
{
    public function index()
    {
        return ParkingArea::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'code' => 'required|string|unique:parking_areas',
            'total_capacity' => 'required|integer',
        ]);

        $area = ParkingArea::create($validated);
        return response()->json($area, 201);
    }

    public function update(Request $request, ParkingArea $area)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'total_capacity' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $area->update($validated);
        return response()->json($area);
    }

    public function destroy(ParkingArea $area)
    {
        $area->delete();
        return response()->noContent();
    }
}
