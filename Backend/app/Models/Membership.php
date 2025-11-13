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

    // Relationship with MembershipPlan
    public function plan()
    {
        return $this->belongsTo(MembershipPlan::class, 'type', 'type');
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
    public static function calculateEndDate($type, $startDate = null)
    {
        $start = $startDate ? Carbon::parse($startDate) : Carbon::now();
        
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

    // Get price based on type - NOW USES MEMBERSHIP PLAN
    public static function getPrice($type)
    {
        return MembershipPlan::getPriceByType($type);
    }

    // Create membership with plan-based pricing
    public static function createWithPlan($userId, $type, $startDate = null)
    {
        $startDate = $startDate ?: now();
        $price = self::getPrice($type);
        $endDate = self::calculateEndDate($type, $startDate);

        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'price' => $price,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active'
        ]);
    }

    // Get current plan details
    public function getPlanDetailsAttribute()
    {
        return MembershipPlan::getPlanByType($this->type);
    }

    // Renew membership
    public function renew()
    {
        $newStartDate = $this->end_date->copy()->addDay();
        $newEndDate = self::calculateEndDate($this->type, $newStartDate);
        $price = self::getPrice($this->type);

        return self::create([
            'user_id' => $this->user_id,
            'type' => $this->type,
            'price' => $price,
            'start_date' => $newStartDate,
            'end_date' => $newEndDate,
            'status' => 'active'
        ]);
    }

    // Check if membership is expiring soon (within 7 days)
    public function getIsExpiringSoonAttribute()
    {
        return $this->isActive() && $this->days_remaining <= 7;
    }
}