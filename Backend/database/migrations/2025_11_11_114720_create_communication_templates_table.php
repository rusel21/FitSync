<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communication_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subject');
            $table->text('content');
            $table->enum('type', ['email', 'sms', 'notification'])->default('email');
            $table->enum('category', ['payment', 'birthday', 'renewal', 'promotion', 'general'])->default('general');
            $table->boolean('is_active')->default(true);
            $table->json('variables')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_templates');
    }
};