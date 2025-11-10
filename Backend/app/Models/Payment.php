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
        'status',
        'description',
        'payment_details',
        'paid_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_details' => 'array',
        'paid_at' => 'datetime'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Membership
    public function membership()
    {
        return $this->belongsTo(Membership::class);
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
}