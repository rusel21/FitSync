<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SentMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'sender_id',
        'recipient_type',
        'recipient_ids',
        'subject',
        'content',
        'message_type',
        'channel',
        'status',
        'scheduled_at',
        'sent_at',
        'metadata'
    ];

    protected $casts = [
        'recipient_ids' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'metadata' => 'array'
    ];

    /**
     * Relationship with template
     */
    public function template()
    {
        return $this->belongsTo(CommunicationTemplate::class, 'template_id');
    }

    /**
     * Relationship with sender (staff)
     */
    public function sender()
    {
        return $this->belongsTo(Staff::class, 'sender_id');
    }

    /**
     * Scope sent messages
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope scheduled messages
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope failed messages
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Get recipient count
     */
    public function getRecipientCountAttribute()
    {
        return count($this->recipient_ids ?? []);
    }

    /**
     * Mark as sent
     */
    public function markAsSent()
    {
        $this->status = 'sent';
        $this->sent_at = now();
        $this->save();
    }
}