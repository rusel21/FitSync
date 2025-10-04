<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staffs';
    protected $primaryKey = 'staff_id'; // <-- change this to your actual PK column
    public $incrementing = false;       // because it's not auto-increment
    protected $keyType = 'string';      // because Staff-0001 is a string

    // Default primary key is "id" (auto-increment), so no need to override
    protected $fillable = [
        'staff_id', 'name', 'email', 'password', 'role', 'phone', 'address','picture'
    ];

    // Auto-generate staff_id like STF0001 when creating
   protected static function boot()
{
    parent::boot();

    static::creating(function ($staff) {
        if (!$staff->staff_id) {
            // Get the last staff ordered by numeric part of staff_id
            $lastStaff = self::orderByRaw("CAST(SUBSTRING(staff_id, 6) AS UNSIGNED) DESC")->first();

            $nextId = 1;
            if ($lastStaff) {
                // Extract numeric part (e.g. from Staff-0001 → 1)
                $lastNumber = (int) substr($lastStaff->staff_id, 6);
                $nextId = $lastNumber + 1;
            }

            // Generate new staff_id
            $staff->staff_id = 'Staff-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
        }
    });
}

}
