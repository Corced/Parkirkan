<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\ParkingArea;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function adminStats()
    {
        return response()->json([
            'total_revenue' => Transaction::where('status', 'completed')->sum('total_cost'),
            'total_users' => User::count(),
            'parked_vehicles' => Vehicle::whereHas('transactions', function($q) {
                $q->where('status', 'active'); // Assuming active transaction means parked
            })->count(), // Or use simple logic if 'total_visits' isn't determining current status
            // A better way for parked count is checking active transactions
            'active_parked_count' => Transaction::where('status', 'active')->count()
        ]);
    }

    public function petugasStats()
    {
        // Petugas might see shift info or local gate stats
        return response()->json([
            'parked_vehicles' => Transaction::where('status', 'active')->count(),
            'today_transactions' => Transaction::whereDate('created_at', Carbon::today())->count(),
        ]);
    }

    public function ownerStats()
    {
        // Owner sees revenue trends
        return response()->json([
            'monthly_revenue' => Transaction::whereMonth('created_at', Carbon::now()->month)->sum('total_cost'),
            'occupancy_rate' => ParkingArea::selectRaw('SUM(occupied_slots) / SUM(total_capacity) * 100 as rate')->value('rate'),
            'total_transactions' => Transaction::count(),
        ]);
    }
}
