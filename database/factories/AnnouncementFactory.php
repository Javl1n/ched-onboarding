<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::where('role', 'admin')->inRandomOrder()->first()?->id ?? User::factory(),
            'department_id' => fake()->boolean(50) ? Department::inRandomOrder()->first()?->id : null,
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'priority' => fake()->randomElement(['low', 'normal', 'high', 'urgent']),
            'status' => 'draft',
            'published_at' => null,
            'expires_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDays(rand(1, 30)),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'urgent',
        ]);
    }

    public function high(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDays(rand(30, 60)),
            'expires_at' => now()->subDays(rand(1, 10)),
        ]);
    }

    public function global(): static
    {
        return $this->state(fn (array $attributes) => [
            'department_id' => null,
        ]);
    }
}
