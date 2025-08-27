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
            'name' => "Unifast",
        ]);

        Department::create([
            'name' => "HR"
        ]);

        Department::create([
            'name' => "Scholarship"
        ]);

        Department::create([
            'name' => "Admin"
        ]);

        Department::create([
            'name' => "IT"
        ]);

        Department::create([
            'name' => "Accounting"
        ]);
    }
}
