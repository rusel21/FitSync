<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    use HasFactory;

    protected $table = 'membership_plans';

    protected $fillable = [
        'name',
        'type',
        'duration',
        'price',
        'original_price',
        'discount',
        'perks',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'perks' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the memberships for this plan
     */
    public function memberships()
    {
        return $this->hasMany(Membership::class, 'type', 'type');
    }

    /**
     * Get active memberships count
     */
    public function getActiveMembersCountAttribute()
    {
        return $this->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->count();
    }

    /**
     * Scope active plans
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope inactive plans
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Format price with Philippine Peso symbol
     */
    public function getFormattedPriceAttribute()
    {
        return '₱' . number_format($this->price, 0);
    }

    /**
     * Format original price with Philippine Peso symbol
     */
    public function getFormattedOriginalPriceAttribute()
    {
        return '₱' . number_format($this->original_price ?: $this->price, 0);
    }

    /**
     * Get formatted discount
     */
    public function getFormattedDiscountAttribute()
    {
        return $this->discount ? $this->discount . '%' : '0%';
    }

    /**
     * Calculate duration in days based on type
     */
    public function getDurationInDaysAttribute()
    {
        return match($this->type) {
            'Daily Plan' => 1,
            'Semi-Monthly Plan' => 15,
            'Monthly Plan' => 30,
            'Premium' => 30,
            'Quarterly' => 90,
            'Yearly' => 365,
            default => 30,
        };
    }

    /**
     * Get display name with type
     */
    public function getDisplayNameAttribute()
    {
        return $this->name . ' (' . $this->type . ')';
    }

    /**
     * Get plan by type
     */
    public static function getPlanByType($type)
    {
        return static::where('type', $type)->where('status', 'active')->first();
    }

    /**
     * Get price for a specific plan type
     */
    public static function getPriceByType($type)
    {
        $plan = static::getPlanByType($type);
        
        if ($plan) {
            return (float) $plan->price;
        }
        
        // Fallback to default prices if no plan exists
        return self::getDefaultPrice($type);
    }

    /**
     * Get default price if no plan exists (fallback)
     */
    private static function getDefaultPrice($type)
    {
        return match($type) {
            'Daily Plan' => 10.00,
            'Semi-Monthly Plan' => 45.00,
            'Monthly Plan' => 79.00,
            'Premium' => 99.00,
            'Yearly' => 948.00, // 79 * 12
            'Quarterly' => 267.00, // 89 * 3
            default => 79.00,
        };
    }

    /**
     * Check if plan has any active memberships
     */
    public function hasActiveMemberships()
    {
        return $this->memberships()
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->exists();
    }
}