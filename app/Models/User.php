<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        "department_id",
        "role",
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $with = [
        'profile'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function profile()
    {
        // if ($this->role !== "trainee") {return};

        return $this->hasOne(TraineeProfile::class); 
    }

    public function roleIs($role)
    {
        return $this->role === $role;
    }

    public function traineeAssessments()
    {
        return $this->hasMany(TraineeAssessment::class, 'supervisor_id');
    }

    public function supervisorAssessments()
    {
        return $this->hasMany(SupervisorAssessment::class, 'supervisor_id');
    }
}
