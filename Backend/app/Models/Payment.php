<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'membership_id',
        'reference_number',
        'amount',
        'currency',
        'payment_method',
        'phone_number',
        'email', // Added for email OTP
        'status',
        'description',
        'payment_details',
        'paid_at',
        'otp_verified_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_details' => 'array',
        'paid_at' => 'datetime',
        'otp_verified_at' => 'datetime'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Membership
    public function membership()
    {
        return $this->belongsTo(Membership::class, 'membership_id');
    }

    // Relationship with OTP Verification
    public function otpVerification()
    {
        return $this->hasOne(OtpVerification::class);
    }

    // Generate reference number
    public static function generateReferenceNumber()
    {
        return 'FSPAY' . date('Ymd') . str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }

    // Check if payment is successful
    public function isSuccessful()
    {
        return $this->status === 'completed';
    }

    // Check if payment is pending OTP verification
    public function isPendingOtp()
    {
        return $this->status === 'pending_otp';
    }

    // Check if OTP is verified
    public function isOtpVerified()
    {
        return !is_null($this->otp_verified_at);
    }

    // Get formatted amount
    public function getFormattedAmountAttribute()
    {
        return '₱' . number_format($this->amount, 2);
    }

    // Scope for pending payments
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Scope for completed payments
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Scope for pending OTP payments
    public function scopePendingOtp($query)
    {
        return $query->where('status', 'pending_otp');
    }

    // Scope for OTP verified payments
    public function scopeOtpVerified($query)
    {
        return $query->whereNotNull('otp_verified_at');
    }

    // Mark OTP as verified
    public function markOtpAsVerified()
    {
        $this->update([
            'otp_verified_at' => now()
        ]);
    }

    // Get payment status with OTP info
    public function getStatusWithOtpAttribute()
    {
        $status = $this->status;
        
        if ($this->isPendingOtp()) {
            return 'pending_otp_verification';
        }
        
        if ($status === 'pending' && $this->isOtpVerified()) {
            return 'pending_payment_processing';
        }
        
        return $status;
    }

    // Get the email for OTP (either from payment or user)
    public function getOtpEmailAttribute()
    {
        return $this->email ?? $this->user->email;
    }
}