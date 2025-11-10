<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'price',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'price' => 'decimal:2'
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Check if membership is active
    public function isActive()
    {
        return $this->status === 'active' && Carbon::now()->lessThanOrEqualTo($this->end_date);
    }

    // Get days remaining
    public function getDaysRemainingAttribute()
    {
        if (!$this->isActive()) {
            return 0;
        }
        
        return Carbon::now()->diffInDays($this->end_date, false);
    }

    // Calculate end date based on type
    public static function calculateEndDate($type, $startDate)
    {
        $start = Carbon::parse($startDate);
        
        return match($type) {
            'Daily Plan' => $start->copy()->addDay(),
            'Semi-Monthly Plan' => $start->copy()->addDays(15),
            'Monthly Plan' => $start->copy()->addMonth(),
            'Premium' => $start->copy()->addMonth(),
            'Yearly' => $start->copy()->addYear(),
            'Quarterly' => $start->copy()->addMonths(3),
            default => $start->copy()->addMonth(),
        };
    }

    // Get price based on type
    public static function getPrice($type)
    {
        return match($type) {
            'Daily Plan' => 10.00,
            'Semi-Monthly Plan' => 45.00,
            'Monthly Plan' => 79.00,
            'Premium' => 99.00,
            'Yearly' => 79.00, // per month equivalent
            'Quarterly' => 89.00, // per month equivalent
            default => 79.00,
        };
    }
}