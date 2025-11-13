<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('payment_id')->constrained()->onDelete('cascade');
            $table->string('otp_code', 6);
            $table->timestamp('expires_at');
            $table->boolean('used')->default(false);
            $table->timestamp('used_at')->nullable();
            $table->integer('attempts')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'payment_id']);
            $table->index('expires_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('otp_verifications');
    }
};