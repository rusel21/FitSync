<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('check_in')->nullable();
            $table->timestamp('check_out')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->enum('status', ['present', 'absent', 'late'])->default('present');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_attendance_logs');
    }
};