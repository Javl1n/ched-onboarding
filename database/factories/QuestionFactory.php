<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content' => fake()->sentence(10),
            'for' => fake()->randomElement(['supervisor', 'trainee']),
            'type' => fake()->randomElement(['scale', 'text']),
            'category' => fake()->randomElement(['Quality of Work', 'Productivity', 'General']),
            'order' => fake()->numberBetween(1, 100),
        ];
    }
}
