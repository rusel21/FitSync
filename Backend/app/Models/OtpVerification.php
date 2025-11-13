<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_id',
        'otp_code',
        'expires_at',
        'used',
        'used_at',
        'attempts'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'used' => 'boolean'
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * Scope for valid OTPs
     */
    public function scopeValid($query)
    {
        return $query->where('used', false)
                    ->where('expires_at', '>', now());
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    /**
     * Mark as used
     */
    public function markAsUsed()
    {
        $this->update([
            'used' => true,
            'used_at' => now()
        ]);
    }
}