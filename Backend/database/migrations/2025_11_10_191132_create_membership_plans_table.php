<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->nullable(); // Daily Plan, Monthly Plan, Premium, etc.
            $table->string('duration');
            $table->decimal('price', 10, 2); // Using 10,2 for Philippine Peso amounts
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('discount')->default('0%');
            $table->json('perks')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('membership_plans');
    }
};