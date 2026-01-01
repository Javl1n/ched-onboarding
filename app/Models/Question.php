<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionFactory> */
    use HasFactory;

    protected $fillable = [
        'content',
        'for',
        'type',
        'category',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'for' => 'string',
            'type' => 'string',
            'order' => 'integer',
        ];
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function traineeAssessments(): HasMany
    {
        return $this->hasMany(TraineeAssessment::class);
    }

    public function supervisorAssessments(): HasMany
    {
        return $this->hasMany(SupervisorAssessment::class);
    }
}
