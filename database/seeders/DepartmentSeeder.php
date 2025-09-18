<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::create([
            'name' => "Admin"
        ]);

        Department::create([
            'name' => "Administration",
        ]);

        Department::create([
            'name' => "Unifast Region 12",
        ]);

        Department::create([
            'name' => "Unifast BARMM"
        ]);

        Department::create([
            'name' => "HR"
        ]);

        Department::create([
            'name' => "HEMIS"
        ]);

        Department::create([
            'name' => "Accounting"
        ]);
        
        Department::create([
            'name' => "Regional Director"
        ]);

        Department::create([
            'name' => "Technical"
        ]);
    }
}
