<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TraineeReport extends Model
{
protected $fillable = ['content', "trainee_id"];

    public function trainee()
    {
        return $this->belongsTo(TraineeProfile::class, 'trainee_id');
    }
}
