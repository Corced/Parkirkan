<?php

namespace Database\Seeders;

use App\Models\ParkingArea;
use Illuminate\Database\Seeder;

class ParkingAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data to ensure IDs match screenshot
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('parking_areas')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        ParkingArea::create([
            'name' => 'Parkiran Depan (Motor)',
            'code' => 'A1',
            'total_capacity' => 100,
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Closed Basement (Mobil)',
            'code' => 'B1',
            'total_capacity' => 50,
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Area Belakang (Truck Logistik)',
            'code' => 'C1',
            'total_capacity' => 90,
            'description' => 'Parkiran untuk logistik',
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Open Basement (Mobil Sports)',
            'code' => 'B2',
            'total_capacity' => 50,
            'description' => 'Khusus Mobil Sports',
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Open Basement (Motor Sports)',
            'code' => 'A2',
            'total_capacity' => 70,
            'description' => 'Khusus motor sports',
            'occupied_slots' => 0,
            'is_active' => true,
        ]);
    }
}
