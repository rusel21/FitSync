<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class Staff extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'staffs';

    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'picture'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the picture URL attribute
     */
    public function getPictureUrlAttribute()
    {
        if ($this->picture) {
            // Check if it's already a full URL
            if (filter_var($this->picture, FILTER_VALIDATE_URL)) {
                return $this->picture;
            }
            return asset('storage/' . $this->picture);
        }
        
        return null;
    }

    /**
     * Generate staff ID automatically
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($staff) {
            // Only generate staff_id if it's not already set and the column exists
            if (empty($staff->staff_id) && Schema::hasColumn('staffs', 'staff_id')) {
                try {
                    $prefix = $staff->role === 'Admin' ? 'ADMIN' : 'STAFF';
                    
                    // Get the latest staff with similar prefix
                    $latestStaff = static::where('staff_id', 'like', $prefix . '-%')
                        ->orderBy('staff_id', 'desc')
                        ->first();
                    
                    if ($latestStaff) {
                        // Extract number and increment
                        $number = (int) str_replace($prefix . '-', '', $latestStaff->staff_id) + 1;
                    } else {
                        $number = 1;
                    }
                    
                    $staff->staff_id = $prefix . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
                    
                } catch (\Exception $e) {
                    Log::error('Failed to generate staff_id: ' . $e->getMessage());
                    // Fallback: use ID-based staff_id
                    $staff->staff_id = 'STAFF-' . uniqid();
                }
            }
        });
    }

    /**
     * Safe accessor for staff_id - fallback to id if staff_id doesn't exist
     */
    public function getSafeStaffIdAttribute()
    {
        return $this->staff_id ?? 'STAFF-' . $this->id;
    }

    /**
     * Route notifications for the mail channel.
     */
    public function routeNotificationForMail($notification = null)
    {
        return $this->email;
    }

    /**
     * Check if staff is admin
     */
    public function isAdmin()
    {
        return $this->role === 'Admin';
    }

    /**
     * Check if staff is regular staff
     */
    public function isStaff()
    {
        return $this->role === 'Staff';
    }
}