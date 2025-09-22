<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionFactory> */
    use HasFactory;

    public function assessment()
    {
        if (auth()->user()->role() !== "trainee") {
            return $this->hasMany(TraineeAssessment::class, "");
        }
        
        return;
    }
}
