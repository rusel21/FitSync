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
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('reported_by');
            $table->enum('reported_by_type', ['member', 'staff', 'system'])->default('staff');
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->enum('status', ['Pending', 'In Progress', 'Completed', 'Cancelled'])->default('Pending');
            $table->foreignId('assigned_to')->nullable()->constrained('staffs')->onDelete('set null'); // Updated to 'staffs'
            $table->decimal('estimated_hours', 5, 2)->nullable();
            $table->decimal('actual_hours', 5, 2)->nullable();
            $table->timestamp('estimated_completion')->nullable();
            $table->timestamp('actual_completion')->nullable();
            $table->json('parts_used')->nullable();
            $table->decimal('labor_cost', 10, 2)->default(0);
            $table->decimal('parts_cost', 10, 2)->default(0);
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->text('technician_notes')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();

            // Indexes for better performance
            $table->index('status');
            $table->index('priority');
            $table->index('estimated_completion');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_requests');
    }
};