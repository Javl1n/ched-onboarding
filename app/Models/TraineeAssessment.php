<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraineeAssessment extends Model
{
    /** @use HasFactory<\Database\Factories\TraineeAssessmentFactory> */
    use HasFactory;

    protected $fillable = [
        "trainee_id", "supervisor_id", "question_id", "value"
    ];

    public function trainee() {
        return $this->belongsTo(TraineeProfile::class, 'trainee_id');
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
