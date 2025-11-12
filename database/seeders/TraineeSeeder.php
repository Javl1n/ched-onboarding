<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\TraineeProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TraineeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = [
            "South East Asian Intitute of Technology, Inc. (SEAIT)" => [
                // [
                //     "name" => "Kaye C. Ambrosio", 
                //     "department" => "Technical Division", 
                //     "gender" => "Female"
                // ],
                [
                    "name" => "Angelie V. Basilango", 
                    "department" => "Technical Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Chrizel G. Dela Gracia", 
                    "department" => "Unifast Region XII", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Pauline R. Lasprilla", 
                    "department" => "Office of the Regional Director", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Cherry Ann Soberano", 
                    "department" => "Technical Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Angel Parrocha", 
                    "department" => "Technical Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Cynie Cabanban", 
                    "department" => "Administrative Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Jerome Macalisang", 
                    "department" => "Technical Division", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jesillo Bacongco", 
                    "department" => "Technical Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Jhayson Saplad", 
                    "department" => "HEMIS Unit", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Marjorie Lagmay", 
                    "department" => "Administrative Division", 
                    "gender" => "Female"
                ],
                [
                    "name" => "Arjay Curay", 
                    "department" => "Accounting Office", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jhon Denver Aloot", 
                    "department" => "Administrative Division", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Nichol Galano", 
                    "department" => "Human Resource Office", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Elphen Adolfo", 
                    "department" => "Technical Division", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jonald Calañes", 
                    "department" => "Technical Division", 
                    "gender" => "Male"
                ],
            ],
            "Sultan Kudarat State University (SKSU)" => [
                [
                    "name" => "John Lloyd Resurrection", 
                    "department" => "HEMIS Unit", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Faith Grace Barcelona", 
                    "department" => "HEMIS Unit", 
                    "gender" => "Female"
                ],
            ],
            "Systems Technology Institute (STI)" => [
                [
                    "name" => "Edrian Libano", 
                    "department" => "Technical Division", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Brian Barba", 
                    "department" => "Accounting Office", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jamil Bataga", 
                    "department" => "Unifast XII BARMM", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jan Christian Egasan", 
                    "department" => "Accounting Office", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Jasper Dela Cruz", 
                    "department" => "Technical Division", 
                    "gender" => "Male"
                ],
                [
                    "name" => "Kenneth Calibara", 
                    "department" => "HEMIS Unit", 
                    "gender" => "Male"
                ],
            ]
        ];

        

        User::factory()
            ->has(TraineeProfile::factory(state: [
                'gender' => 'Female',
                'school' => 'South East Asian Intitute of Technology, Inc. (SEAIT)'
            ]), 'profile')
            ->create([
                'name' => 'Kaye C. Ambrosio',
                'email' => 'trainee@gmail.com',
                'role' => 'trainee',
                'department_id' => Department::where('name', 'Technical Division')->first()->id,
            ]);

        User::factory()
            ->has(TraineeProfile::factory(state: [
                'gender' => 'Male',
                'school' => 'South East Asian Intitute of Technology, Inc. (SEAIT)'
            ]), 'profile')
            ->create([
                'name' => 'Frank Leimbergh D. Armodia',
                'email' => 'farmodia@gmail.com',
                'role' => 'trainee',
                'department_id' => Department::where('name', 'HEMIS Unit')->first()->id,
            ]);

        // TraineeProfile::factory(30)->create();

        foreach ($schools as $school => $trainees) {
            foreach($trainees as $trainee) {
                User::factory()
                ->has(TraineeProfile::factory([
                    "gender" => $trainee['gender'],
                    "school" => $school,
                ]), 'profile')
                ->create([
                    "name" => $trainee['name'],
                    "email" => Str::snake($trainee['name']) . '@gmail.com',
                    "role" => 'trainee',
                    "department_id" => Department::where('name', $trainee['department'])->first()->id
                ]);
            }
        }
    }
}
