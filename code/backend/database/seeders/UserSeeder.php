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
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Alexander Pierce',
                'email' => 'admin@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'admin1'],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'admin1@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'admin2'],
            [
                'name' => 'Siska Wijaya',
                'email' => 'admin2@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'admin3'],
            [
                'name' => 'Bambang Herlambang',
                'email' => 'admin3@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'budi'],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'petugas',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'siti'],
            [
                'name' => 'Siti Rahma',
                'email' => 'siti@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'petugas',
                'is_active' => true,
            ]
        );

        User::updateOrCreate(
            ['username' => 'owner'],
            [
                'name' => 'Owner Parkir',
                'email' => 'owner@parkirkan.id',
                'password' => Hash::make('password'),
                'role' => 'owner',
                'is_active' => true,
            ]
        );
    }
}
