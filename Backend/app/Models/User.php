<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{

        public function attendanceLogs()
        {
            return $this->hasMany(UserAttendanceLog::class, 'user_id');
        }
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'address',
        'contact',
        'role',
        'picture',
        'membership_type',
        'user_id', // ✅ added here
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Auto-generate SYNC-XXXX user_id when creating a new user.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->user_id)) {
                $lastUser = User::orderBy('id', 'desc')->first();
                $nextNumber = $lastUser && $lastUser->user_id
                    ? ((int) substr($lastUser->user_id, 5)) + 1
                    : 1;

                $user->user_id = 'SYNC-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
            }
        });
    }


            public function memberships()
        {
            return $this->hasMany(Membership::class);
        }

        public function currentMembership()
        {
            return $this->hasOne(Membership::class)
                ->where('status', 'active')
                ->where('end_date', '>=', now())
                ->latest();
        }


                // Add this relationship to your existing User model
        public function payments()
        {
            return $this->hasMany(Payment::class);
        }

        public function latestPayment()
        {
            return $this->hasOne(Payment::class)->latest();
        }
}
