<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['Daily Plan', 'Semi-Monthly Plan', 'Monthly Plan', 'Premium', 'Yearly', 'Quarterly']);
            $table->decimal('price', 8, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'cancelled', 'pending'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('memberships');
    }
};