<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Equipment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'category',
        'model',
        'serial_number',
        'location',
        'status',
        'purchase_date',
        'purchase_price',
        'last_maintenance',
        'next_maintenance',
        'maintenance_interval_days',
        'warranty_expiry',
        'usage_hours',
        'condition_notes',
        'specifications'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'purchase_price' => 'decimal:2',
        'last_maintenance' => 'date',
        'next_maintenance' => 'date',
        'warranty_expiry' => 'date',
        'maintenance_interval_days' => 'integer',
        'usage_hours' => 'integer',
        'specifications' => 'array'
    ];

    /**
     * Get maintenance requests for this equipment
     */
    public function maintenanceRequests()
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    /**
     * Check if equipment needs maintenance
     */
    public function getNeedsMaintenanceAttribute()
    {
        if (!$this->next_maintenance) {
            return false;
        }
        return Carbon::now()->greaterThanOrEqualTo($this->next_maintenance);
    }

    /**
     * Get days until next maintenance
     */
    public function getDaysUntilMaintenanceAttribute()
    {
        if (!$this->next_maintenance) {
            return null;
        }
        return Carbon::now()->diffInDays($this->next_maintenance, false);
    }

    /**
     * Check if warranty is valid
     */
    public function getUnderWarrantyAttribute()
    {
        if (!$this->warranty_expiry) {
            return false;
        }
        return Carbon::now()->lessThanOrEqualTo($this->warranty_expiry);
    }

    /**
     * Scope operational equipment
     */
    public function scopeOperational($query)
    {
        return $query->where('status', 'Operational');
    }

    /**
     * Scope equipment under maintenance
     */
    public function scopeUnderMaintenance($query)
    {
        return $query->where('status', 'Maintenance');
    }

    /**
     * Scope equipment that needs maintenance
     */
    public function scopeNeedsMaintenance($query)
    {
        return $query->where('next_maintenance', '<=', now());
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Schedule next maintenance
     */
    public function scheduleNextMaintenance()
    {
        if ($this->maintenance_interval_days) {
            $this->next_maintenance = now()->addDays($this->maintenance_interval_days);
            $this->save();
        }
    }

    /**
     * Mark as maintained
     */
    public function markAsMaintained($notes = null)
    {
        $this->last_maintenance = now();
        $this->scheduleNextMaintenance();
        if ($notes) {
            $this->condition_notes = $notes;
        }
        $this->save();
    }
}