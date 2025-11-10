<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('membership_id')->constrained()->onDelete('cascade');
                $table->string('reference_number')->unique();
                $table->decimal('amount', 10, 2);
                $table->string('currency')->default('PHP');
                $table->enum('payment_method', ['gcash', 'paymaya', 'bank_transfer', 'credit_card']);
                $table->string('phone_number')->nullable();
                $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled'])->default('pending');
                $table->text('description')->nullable();
                $table->json('payment_details')->nullable();
                $table->timestamp('paid_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};