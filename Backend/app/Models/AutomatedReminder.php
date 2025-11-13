<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutomatedReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'trigger_event',
        'days_before',
        'days_after',
        'template_id',
        'is_active',
        'conditions',
        'last_sent'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'conditions' => 'array',
        'last_sent' => 'datetime'
    ];

    /**
     * Relationship with template
     */
    public function template()
    {
        return $this->belongsTo(CommunicationTemplate::class);
    }

    /**
     * Scope active reminders
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Check if reminder should be sent
     */
    public function shouldSend($targetDate)
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();
        $target = \Carbon\Carbon::parse($targetDate);

        if ($this->days_before) {
            $reminderDate = $target->subDays($this->days_before);
            if ($now->isSameDay($reminderDate)) {
                return true;
            }
        }

        if ($this->days_after) {
            $reminderDate = $target->addDays($this->days_after);
            if ($now->isSameDay($reminderDate)) {
                return true;
            }
        }

        return false;
    }
}