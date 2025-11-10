<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting staff seeding...');

        // First, let's check if the staffs table exists
        try {
            $tableExists = DB::select("SHOW TABLES LIKE 'staffs'");
            if (empty($tableExists)) {
                $this->command->error('Staffs table does not exist. Please run migrations first.');
                return;
            }
        } catch (\Exception $e) {
            $this->command->error('Error checking table: ' . $e->getMessage());
            return;
        }

        // Create admin user directly without using the model's boot method
        $this->createAdminUser();

        $this->command->info('Staff seeding completed!');
    }

    private function createAdminUser(): void
    {
        $adminEmail = 'admin@fitsync.com';
        
        // Check if admin already exists
        $existingAdmin = DB::table('staffs')->where('email', $adminEmail)->first();
        if ($existingAdmin) {
            $this->command->info('✅ Admin user already exists.');
            return;
        }

        // Get the next admin ID manually
        $latestAdmin = DB::table('staffs')
            ->where('staff_id', 'like', 'ADMIN-%')
            ->orderBy('staff_id', 'desc')
            ->first();

        $adminNumber = $latestAdmin ? ((int) str_replace('ADMIN-', '', $latestAdmin->staff_id) + 1) : 1;
        $adminId = 'ADMIN-' . str_pad($adminNumber, 4, '0', STR_PAD_LEFT);

        // Insert admin user directly
        DB::table('staffs')->insert([
            'staff_id' => $adminId,
            'name' => 'System Administrator',
            'email' => $adminEmail,
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
            'phone' => '+1234567890',
            'address' => 'FitSync Headquarters',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info("✅ Admin user created successfully with ID: {$adminId}");
        $this->command->info('Admin Login: admin@fitsync.com / admin123');
    }
}