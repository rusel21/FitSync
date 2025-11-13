<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // For MySQL
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE memberships MODIFY status VARCHAR(255) DEFAULT 'pending'");
        } 
        // For SQLite
        else {
            Schema::table('memberships', function (Blueprint $table) {
                $table->string('status')->default('pending')->change();
            });
        }
        
        // Update any existing NULL values to 'pending'
        DB::table('memberships')->whereNull('status')->update(['status' => 'pending']);
    }

    public function down()
    {
        // If you need to revert, change back to ENUM - but specify your actual ENUM values
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE memberships MODIFY status ENUM('active', 'pending', 'expired', 'cancelled') DEFAULT 'pending'");
        } else {
            // SQLite doesn't support ENUM easily, so we keep it as string
            Schema::table('memberships', function (Blueprint $table) {
                $table->string('status')->default('pending')->change();
            });
        }
    }
};