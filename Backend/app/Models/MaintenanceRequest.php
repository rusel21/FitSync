<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipment_id',
        'title',
        'description',
        'reported_by',
        'reported_by_type',
        'priority',
        'status',
        'assigned_to',
        'estimated_hours',
        'actual_hours',
        'estimated_completion',
        'actual_completion',
        'parts_used',
        'labor_cost',
        'parts_cost',
        'total_cost',
        'technician_notes',
        'resolution_notes'
    ];

    protected $casts = [
        'estimated_completion' => 'datetime',
        'actual_completion' => 'datetime',
        'estimated_hours' => 'decimal:2',
        'actual_hours' => 'decimal:2',
        'labor_cost' => 'decimal:2',
        'parts_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'parts_used' => 'array'
    ];

    /**
     * Relationship with Equipment
     */
    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Relationship with assigned staff - UPDATED for 'staffs' table
     */
    public function assignedStaff()
    {
        return $this->belongsTo(Staff::class, 'assigned_to');
    }

    /**
     * Scope high priority requests
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', 'High');
    }

    /**
     * Scope critical priority requests
     */
    public function scopeCritical($query)
    {
        return $query->where('priority', 'Critical');
    }

    /**
     * Scope pending requests
     */
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    /**
     * Scope in progress requests
     */
    public function scopeInProgress($query)
    {
        return $query->where('status', 'In Progress');
    }

    /**
     * Check if request is overdue
     */
    public function getIsOverdueAttribute()
    {
        if ($this->estimated_completion && $this->status !== 'Completed') {
            return now()->greaterThan($this->estimated_completion);
        }
        return false;
    }

    /**
     * Calculate total cost
     */
    public function calculateTotalCost()
    {
        $this->total_cost = $this->labor_cost + $this->parts_cost;
        return $this->total_cost;
    }

    /**
     * Mark request as completed
     */
    public function markAsCompleted($resolutionNotes = null, $actualHours = null)
    {
        $this->status = 'Completed';
        $this->actual_completion = now();
        
        if ($actualHours) {
            $this->actual_hours = $actualHours;
        }
        
        if ($resolutionNotes) {
            $this->resolution_notes = $resolutionNotes;
        }
        
        $this->calculateTotalCost();
        $this->save();

        // Update equipment maintenance date
        if ($this->equipment) {
            $this->equipment->markAsMaintained($resolutionNotes);
        }
    }

    /**
     * Assign to staff
     */
    public function assignToStaff($staffId, $estimatedHours = null, $estimatedCompletion = null)
    {
        $this->assigned_to = $staffId;
        $this->status = 'In Progress';
        
        if ($estimatedHours) {
            $this->estimated_hours = $estimatedHours;
        }
        
        if ($estimatedCompletion) {
            $this->estimated_completion = $estimatedCompletion;
        }
        
        $this->save();
    }
}