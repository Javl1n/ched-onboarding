<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraineeAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\TraineeAssessmentFactory> */
    use HasFactory;

    public function trainee() {
        return $this->belongsTo(TraineeProfile::class, 'supervisor_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
