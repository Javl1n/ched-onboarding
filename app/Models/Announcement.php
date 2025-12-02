<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Announcement extends Model
{
    /** @use HasFactory<\Database\Factories\AnnouncementFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'title',
        'content',
        'priority',
        'status',
        'published_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(AnnouncementNotification::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeForUser($query, User $user)
    {
        if ($user->role === 'trainee') {
            return $query->where(function ($q) use ($user) {
                $q->whereNull('department_id')
                    ->orWhere('department_id', $user->department_id);
            });
        }

        if ($user->role === 'supervisor') {
            return $query->where(function ($q) use ($user) {
                $q->whereNull('department_id')
                    ->orWhere('department_id', $user->department_id);
            });
        }

        return $query;
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function publish(): void
    {
        $wasPublished = $this->status === 'published';

        $this->status = 'published';
        $this->published_at = $this->published_at ?? now();
        $this->save();

        if (! $wasPublished) {
            $this->notifyTrainees();
        }
    }

    public function notifyTrainees(): void
    {
        $trainees = $this->department_id
            ? User::where('department_id', $this->department_id)
                ->where('role', 'trainee')
                ->get()
            : User::where('role', 'trainee')->get();

        if ($trainees->isEmpty()) {
            return;
        }

        $notificationData = $trainees->map(fn ($trainee) => [
            'announcement_id' => $this->id,
            'user_id' => $trainee->id,
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        AnnouncementNotification::insert($notificationData);
    }

    public function markAsReadBy(User $user): void
    {
        $this->notifications()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function isReadBy(User $user): bool
    {
        return $this->notifications()
            ->where('user_id', $user->id)
            ->whereNotNull('read_at')
            ->exists();
    }

    public function unreadByUser(User $user): bool
    {
        return ! $this->isReadBy($user);
    }
}
