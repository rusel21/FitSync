<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MembershipPlan;
use Carbon\Carbon;

class MembershipPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Daily Pass',
                'type' => 'Daily Plan',
                'duration' => '1 Day',
                'price' => 50.00,
                'original_price' => 50.00,
                'discount' => '0%',
                'perks' => json_encode([
                    'Single day access',
                    'Basic equipment usage',
                    'Locker access',
                    'Shower facilities'
                ]),
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Semi-Monthly Plan',
                'type' => 'Semi-Monthly Plan',
                'duration' => '15 Days',
                'price' => 350.00,
                'original_price' => 400.00,
                'discount' => '12%',
                'perks' => json_encode([
                    '15 days unlimited access',
                    'All equipment usage',
                    'Locker access',
                    'Shower facilities',
                    'Free towel service',
                    'Basic fitness assessment'
                ]),
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Monthly Membership',
                'type' => 'Monthly Plan',
                'duration' => '30 Days',
                'price' => 500.00,
                'original_price' => 600.00,
                'discount' => '17%',
                'perks' => json_encode([
                    '30 days unlimited access',
                    'All equipment usage',
                    'Locker access',
                    'Shower facilities',
                    'Free towel service',
                    'Basic fitness assessment',
                    '2 free personal training sessions',
                    'Nutrition consultation'
                ]),
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        foreach ($plans as $plan) {
            MembershipPlan::create($plan);
        }

        $this->command->info('Membership plans seeded successfully!');
        $this->command->info('Daily Pass: ₱50.00 per day');
        $this->command->info('Semi-Monthly: ₱350.00 for 15 days');
        $this->command->info('Monthly: ₱500.00 for 30 days');
    }
}