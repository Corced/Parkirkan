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
        // Clear existing data to ensure IDs match screenshot
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('parking_rates')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        ParkingRate::create([
            'vehicle_type' => 'Motor',
            'description' => 'Untuk motor dengan CC 125 s dan CC 150-250',
            'icon' => 'motorsport',
            'grace_period_minutes' => 5,
            'initial_rate' => 2000,
            'hourly_rate' => 1000,
            'daily_max_rate' => 10000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Mobil',
            'description' => 'Untuk mobil dengan CC 1.000 - 2.500 CC',
            'icon' => 'car',
            'grace_period_minutes' => 10,
            'initial_rate' => 5000,
            'hourly_rate' => 3000,
            'daily_max_rate' => 25000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Truk Logistik',
            'description' => 'Untuk logistik',
            'icon' => 'truck',
            'grace_period_minutes' => 15,
            'initial_rate' => 10000,
            'hourly_rate' => 5000,
            'daily_max_rate' => 50000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Motor Gede',
            'description' => 'Untuk motor dengan CC > 250cc - 1000cc+',
            'icon' => 'bicycle',
            'grace_period_minutes' => 5,
            'initial_rate' => 2500,
            'hourly_rate' => 1500,
            'daily_max_rate' => 12000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Mobil Sports',
            'description' => 'Untuk mobil dengan > 2.500 CC',
            'icon' => 'car',
            'grace_period_minutes' => 10,
            'initial_rate' => 10000,
            'hourly_rate' => 5000,
            'daily_max_rate' => 45000,
        ]);
    }
}
