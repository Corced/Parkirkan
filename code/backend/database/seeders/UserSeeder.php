<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Utama',
            'username' => 'admin',
            'email' => 'admin@parkirkan.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Budi Santoso',
            'username' => 'budi',
            'email' => 'budi@parkirkan.id',
            'password' => Hash::make('password'),
            'role' => 'petugas',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Siti Rahma',
            'username' => 'siti',
            'email' => 'siti@parkirkan.id',
            'password' => Hash::make('password'),
            'role' => 'petugas',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Owner Parkir',
            'username' => 'owner',
            'email' => 'owner@parkirkan.id',
            'password' => Hash::make('password'),
            'role' => 'owner',
            'is_active' => true,
        ]);
    }
}
