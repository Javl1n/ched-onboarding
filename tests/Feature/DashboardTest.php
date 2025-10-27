<?php

use App\Models\User;
use Database\Seeders\DepartmentSeeder;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->seed(DepartmentSeeder::class);
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertOk();
});
