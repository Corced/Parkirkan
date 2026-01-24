<?php

namespace Database\Seeders;

use App\Models\ParkingRate;
use Illuminate\Database\Seeder;

class ParkingRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ParkingRate::create([
            'vehicle_type' => 'motor',
            'hourly_rate' => 2000,
            'daily_max_rate' => 10000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'mobil',
            'hourly_rate' => 5000,
            'daily_max_rate' => 25000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'truck',
            'hourly_rate' => 10000,
            'daily_max_rate' => 50000,
        ]);
    }
}
