<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->string('staff_id'); // FK to staffs.staff_id
            $table->dateTime('check_in')->nullable();
            $table->dateTime('check_out')->nullable();
            $table->timestamps();

            $table->foreign('staff_id')->references('staff_id')->on('staffs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_attendance_logs');
    }
};
