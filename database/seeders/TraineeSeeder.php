<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\TraineeProfile;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TraineeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
        ->has(TraineeProfile::factory(), 'profile')
        ->create([
            'name' => 'Frank Leimbergh D. Armodia',
            'email' => 'trainee@gmail.com',
            'role' => "trainee",
            "department_id" => Department::where('name', 'HEMIS')->first()->id,
        ]);
        
        TraineeProfile::factory(30)->create();
    }
}
