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
            'hourly_rate' => 2000,
            'daily_max_rate' => 10000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Mobil',
            'description' => 'Untuk mobil dengan CC 1.000 - 2.500 CC',
            'icon' => 'car',
            'hourly_rate' => 5000,
            'daily_max_rate' => 25000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Truk Logistik',
            'description' => 'Untuk logistik',
            'icon' => 'truck',
            'hourly_rate' => 10000,
            'daily_max_rate' => 50000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Motor Gede',
            'description' => 'Untuk motor dengan CC > 250cc - 1000cc+',
            'icon' => 'bicycle',
            'hourly_rate' => 2500,
            'daily_max_rate' => 12000,
        ]);

        ParkingRate::create([
            'vehicle_type' => 'Mobil Sports',
            'description' => 'Untuk mobil dengan > 2.500 CC',
            'icon' => 'car',
            'hourly_rate' => 7500,
            'daily_max_rate' => 37500,
        ]);
    }
}
