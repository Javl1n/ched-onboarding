<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = [
        "date",
        "morning_in",
        "morning_out",
        "afternoon_in",
        "afternoon_out",
    ];

    public function trainee() {
        return $this->belongsTo(TraineeProfile::class, 'trainee_id');
    }
}
