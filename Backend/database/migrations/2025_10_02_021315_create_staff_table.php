<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staffs', function (Blueprint $table) {
            $table->id(); // This creates auto-incrementing 'id' primary key
            $table->string('staff_id')->unique(); // Keep this as unique identifier
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['Staff', 'Admin'])->default('Staff');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('picture')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};