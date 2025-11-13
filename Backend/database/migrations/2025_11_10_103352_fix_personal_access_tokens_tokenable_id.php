<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // First, clear all existing tokens (they're invalid anyway)
        \Illuminate\Support\Facades\DB::table('personal_access_tokens')->truncate();

        // Change tokenable_id to big integer
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->unsignedBigInteger('tokenable_id')->change();
        });
    }

    public function down(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->string('tokenable_id')->change();
        });
    }
};