<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Storage::deleteDirectory('/profiling');
        Storage::deleteDirectory('/onboarding');

        // User::factory(10)->create();
        $this->call([
            DepartmentSeeder::class,
            SchoolSeeder::class,
        ]);


        User::factory()->create([
            'name' => 'Frank Leimbergh D. Armodia',
            'email' => 'farmodia@gmail.com',
            'role' => "admin",
            "department_id" => 1,
        ]);

        $this->call([
            TraineeSeeder::class,
            TimeLogSeeder::class,
        ]);
    }
}
