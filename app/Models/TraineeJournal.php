<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraineeJournal extends Model
{
    /** @use HasFactory<\Database\Factories\TraineeJournalFactory> */
    use HasFactory;

    protected $fillable = ['trainee_id', 'date', 'content'];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function trainee()
    {
        return $this->belongsTo(TraineeProfile::class, 'trainee_id');
    }
}
