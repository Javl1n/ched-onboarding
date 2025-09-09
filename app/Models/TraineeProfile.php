<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class TraineeProfile extends Model
{
    /** @use HasFactory<\Database\Factories\TraineeProfileFactory> */
    use HasFactory;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs() 
    {
        return $this->hasMany(TimeLog::class, "trainee_id");
    }

    public function logToday()
    {
        return $this->logs()->firstOrCreate([
            "date" => Carbon::now()->setTimezone('Asia/Manila')->format("Y-m-d")
        ]);
    }
}
