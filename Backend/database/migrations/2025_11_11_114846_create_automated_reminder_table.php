<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automated_reminders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['payment', 'birthday', 'renewal', 'promotion']);
            $table->string('trigger_event');
            $table->integer('days_before')->nullable();
            $table->integer('days_after')->nullable();
            $table->foreignId('template_id')->constrained('communication_templates')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->json('conditions')->nullable();
            $table->timestamp('last_sent')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automated_reminders');
    }
};