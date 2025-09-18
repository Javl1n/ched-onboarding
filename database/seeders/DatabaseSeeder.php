<?php

namespace Database\Seeders;

use App\Models\Department;
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
            "department_id" => Department::where('name', 'Admin')->first()->id,
        ]);

        User::factory()->create([
            'name' => 'Leimbergh D. Armodia',
            'email' => 'supervisor@gmail.com',
            'role' => "supervisor",
            "department_id" => Department::where('name', 'IT')->first()->id,
        ]);

        $this->call([
            TraineeSeeder::class,
            TimeLogSeeder::class,
            QuestionSeeder::class,
            PageSeeder::class
        ]);
    }
}
