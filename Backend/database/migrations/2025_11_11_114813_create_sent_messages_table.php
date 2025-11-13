<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sent_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->nullable()->constrained('communication_templates')->onDelete('set null');
            $table->foreignId('sender_id')->nullable()->constrained('staffs')->onDelete('set null');
            $table->string('recipient_type'); // members, staff, specific
            $table->json('recipient_ids'); // Array of recipient IDs
            $table->string('subject');
            $table->text('content');
            $table->enum('message_type', ['bulk', 'individual', 'automated'])->default('bulk');
            $table->enum('channel', ['email', 'sms', 'both'])->default('email');
            $table->enum('status', ['draft', 'scheduled', 'sent', 'failed'])->default('sent');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('sent_at');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sent_messages');
    }
};