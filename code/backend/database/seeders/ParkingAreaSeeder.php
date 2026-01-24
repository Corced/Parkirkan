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
        ParkingArea::create([
            'name' => 'Parkiran Depan (Motor)',
            'code' => 'A1',
            'total_capacity' => 100,
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Basement (Mobil)',
            'code' => 'B1',
            'total_capacity' => 50,
            'occupied_slots' => 0,
            'is_active' => true,
        ]);

        ParkingArea::create([
            'name' => 'Area Belakang (Truck)',
            'code' => 'C1',
            'total_capacity' => 20,
            'occupied_slots' => 0,
            'is_active' => true,
        ]);
    }
}
