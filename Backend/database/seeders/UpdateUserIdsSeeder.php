<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateUserIdsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $counter = 1;

        // Get users ordered by id
        $users = User::orderBy('id')->get();

        foreach ($users as $user) {
            if (empty($user->user_id)) {
                $user->user_id = 'SYNC-' . str_pad($counter, 4, '0', STR_PAD_LEFT);
                $user->save();
            }
            $counter++;
        }
    }
}
