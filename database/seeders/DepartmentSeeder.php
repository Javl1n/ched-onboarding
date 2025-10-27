<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::create([
            'name' => 'Admin',
        ]);

        Department::create([
            'name' => 'Unifast Region XII',
        ]);

        Department::create([
            'name' => 'Unifast XII BARMM',
        ]);

        Department::create([
            'name' => 'Office of the Regional Director',
        ]);

        Department::create([
            'name' => 'Accounting Office',
        ]);

        Department::create([
            'name' => 'HEMIS Unit',
        ]);

        Department::create([
            'name' => 'Administrative Division',
        ]);

        Department::create([
            'name' => 'Technical Division',
        ]);

        Department::create([
            'name' => 'Human Resource Office',
        ]);
    }
}
