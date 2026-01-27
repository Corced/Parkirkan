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
        $now = Carbon::now();
        $thisMonth = $now->month;
        $thisYear = $now->year;

        $lastMonth = $now->copy()->subMonth();
        $lastMonthMonth = $lastMonth->month;
        $lastMonthYear = $lastMonth->year;

        // Revenue
        $monthlyRevenue = Transaction::whereMonth('created_at', $thisMonth)
            ->whereYear('created_at', $thisYear)
            ->where('status', 'completed')
            ->sum('total_cost');

        $prevMonthlyRevenue = Transaction::whereMonth('created_at', $lastMonthMonth)
            ->whereYear('created_at', $lastMonthYear)
            ->where('status', 'completed')
            ->sum('total_cost');

        $revenueChange = $prevMonthlyRevenue > 0 
            ? (($monthlyRevenue - $prevMonthlyRevenue) / $prevMonthlyRevenue) * 100 
            : ($monthlyRevenue > 0 ? 100 : 0);

        // Occupancy (Current State)
        $occupancyRate = ParkingArea::selectRaw('SUM(occupied_slots) / SUM(total_capacity) * 100 as rate')->value('rate');
        
        // Total Transactions (Current Month)
        $totalTransactions = Transaction::whereMonth('created_at', $thisMonth)
            ->whereYear('created_at', $thisYear)
            ->count();

        $prevTotalTransactions = Transaction::whereMonth('created_at', $lastMonthMonth)
            ->whereYear('created_at', $lastMonthYear)
            ->count();

        $transactionsChange = $prevTotalTransactions > 0
            ? (($totalTransactions - $prevTotalTransactions) / $prevTotalTransactions) * 100
            : ($totalTransactions > 0 ? 100 : 0);

        // Revenue Data for Chart (Jan - Dec of Current Year)
        $revenueData = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthName = Carbon::create($thisYear, $m, 1)->format('M');
            $rev = Transaction::whereMonth('created_at', $m)
                ->whereYear('created_at', $thisYear)
                ->where('status', 'completed')
                ->sum('total_cost');
            
            $revenueData[] = [
                'name' => $monthName,
                'value' => (float)$rev
            ];
        }

        return response()->json([
            'monthly_revenue' => (float)$monthlyRevenue,
            'monthly_revenue_change' => round($revenueChange, 1),
            'occupancy_rate' => round($occupancyRate, 1),
            'occupancy_rate_change' => 0, // Simplified: needs historical occupancy logs for real trend
            'total_transactions' => $totalTransactions,
            'total_transactions_change' => round($transactionsChange, 1),
            'revenue_data' => $revenueData,
        ]);
    }
}
