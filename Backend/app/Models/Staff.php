<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Staff extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Explicitly set the table name
    protected $table = 'staffs'; // Change this to whatever your actual table name is

    // Use default integer primary key (recommended)
    protected $primaryKey = 'id';
     public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'staff_id', // This is your unique identifier, not primary key
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
            return asset('storage/' . $this->picture);
        }
        
        return asset('images/default-staff.png');
    }

    /**
     * Generate staff ID automatically
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($staff) {
            if (empty($staff->staff_id)) {
                $prefix = $staff->role === 'Admin' ? 'ADMIN' : 'STAFF';
                $latestStaff = static::where('staff_id', 'like', $prefix . '-%')
                    ->orderBy('staff_id', 'desc')
                    ->first();
                
                $number = $latestStaff ? (int) str_replace($prefix . '-', '', $latestStaff->staff_id) + 1 : 1;
                $staff->staff_id = $prefix . '-' . str_pad($number, 4, '0', STR_PAD_LEFT);
            }
        });
    }
}