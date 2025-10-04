<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('staffs')->insert([
            'staff_id' => 'Staff-0001',
            'name' => 'John Doe',
            'email' => 'staff1@example.com',
            'password' => Hash::make('password123'),
            'role' => 'Staff',
            'phone' => '09123456789',
            'address' => 'Cebu City',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
