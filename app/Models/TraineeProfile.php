<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraineeProfile extends Model
{
    /** @use HasFactory<\Database\Factories\TraineeProfileFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $appends = ['ojt_start_date', 'ojt_duration_in_days'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function logs()
    {
        return $this->hasMany(TimeLog::class, 'trainee_id');
    }

    public function logToday()
    {

        return $this->logs()->firstOrCreate([
            'date' => now('Asia/Manila')->format('Y-m-d'),
        ]);
    }

    public function assessments()
    {
        return $this->hasMany(TraineeAssessment::class, 'trainee_id');
    }

    public function reports()
    {
        return $this->hasMany(TraineeReport::class, 'trainee_id');
    }

    public function supervisorAssessments()
    {
        return $this->hasMany(SupervisorAssessment::class, 'trainee_id');
    }

    public function journals()
    {
        return $this->hasMany(TraineeJournal::class, 'trainee_id');
    }

    /**
     * Scope a query to only include active trainee profiles.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include inactive trainee profiles.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Check if the trainee profile is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the trainee profile is inactive.
     */
    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    /**
     * Mark the trainee profile as inactive.
     */
    public function deactivate(): void
    {
        $this->update([
            'status' => 'inactive',
            'deactivated_at' => now(),
        ]);
    }

    /**
     * Mark the trainee profile as active.
     */
    public function reactivate(): void
    {
        $this->update([
            'status' => 'active',
            'deactivated_at' => null,
        ]);
    }

    /**
     * Get the OJT start date (date of first time log).
     */
    public function getOjtStartDateAttribute(): ?string
    {
        $firstLog = $this->logs()->orderBy('date', 'asc')->first();

        return $firstLog ? $firstLog->date : null;
    }

    /**
     * Get the duration of OJT in days.
     */
    public function getOjtDurationInDaysAttribute(): ?int
    {
        $startDate = $this->ojt_start_date;

        if (! $startDate) {
            return null;
        }

        $endDate = $this->isInactive() && $this->deactivated_at
            ? $this->deactivated_at
            : now();

        return \Carbon\Carbon::parse($startDate)->diffInDays($endDate);
    }
}
