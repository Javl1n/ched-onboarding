<?php

namespace Database\Factories;

use App\Models\School;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TraineeProfile>
 */
class TraineeProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // dd(fake('en_PH')->mobileNumber());
        return [
            "profile" => '/empty_profile.jpg',
            // "user_id" => User::factory()->create(["role" => "trainee"])->id,
            "school" => fake()->word() . " ". fake()->randomElement(["school", "university", "college"]),
            "birth" => fake()->dateTimeBetween('-21 years', '-20 years'),
            "gender" => fake()->randomElement(["Male", "Female"]),
            "contact" => fake()->numberBetween(9000000000, 9999999999),
            "address" =>  $this->address(),
        ];
    }

    protected function address()
    {
        $block = 'Blk. ' . fake()->numberBetween(0, 12) . ', ';
        $lot = 'Lot ' . fake()->numberBetween(0, 20) . ', ';
        $barangay = 'Brgy. ' . fake('en_PH')->barangay() . ', ';
        $municipality = fake('en_PH')->municipality() . ', ';
        $province = fake('en_PH')->province();

        return $block . $lot . $barangay . $municipality . $province;
    }
}
