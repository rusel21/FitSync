<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Option A: Using ENUM (recommended for fixed status values)
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', [
                'pending',
                'pending_otp',
                'completed', 
                'failed',
                'cancelled',
                'expired'
            ])->default('pending')->change();
        });

        // OR Option B: Using string (more flexible)
        // Schema::table('payments', function (Blueprint $table) {
        //     $table->string('status', 20)->default('pending')->change();
        // });
    }

    public function down()
    {
        // Revert back to original status values if needed
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', [
                'pending',
                'completed', 
                'failed',
                'cancelled'
            ])->default('pending')->change();
        });
    }
};