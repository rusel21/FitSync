<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('category');
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable()->unique();
            $table->string('location');
            $table->enum('status', ['Operational', 'Maintenance', 'Out of Service'])->default('Operational');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->date('last_maintenance')->nullable();
            $table->date('next_maintenance')->nullable();
            $table->integer('maintenance_interval_days')->nullable();
            $table->date('warranty_expiry')->nullable();
            $table->integer('usage_hours')->default(0);
            $table->text('condition_notes')->nullable();
            $table->json('specifications')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better performance
            $table->index('status');
            $table->index('category');
            $table->index('next_maintenance');
            $table->index('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};