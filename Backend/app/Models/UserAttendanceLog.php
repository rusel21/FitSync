<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAttendanceLog extends Model
{
    use HasFactory;

    protected $table = 'user_attendance_logs'; // table name in the database
    protected $fillable = [
        'user_id',
        'check_in',
        'check_out',
    ]; 

    public $timestamps = true; //uses create_at and update_at

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
    
}
