<?php

use App\Models\Department;
use App\Models\Question;
use App\Models\User;

it('admin can view questions index', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);

    $response = $this->actingAs($admin)->get('/questions');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('questions/index')
        ->has('supervisorQuestions')
        ->has('traineeQuestions')
        ->has('categories')
    );
});

it('admin can create a question', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);

    $response = $this->actingAs($admin)->post('/questions', [
        'content' => 'Test question content here',
        'for' => 'supervisor',
        'type' => 'scale',
        'category' => 'Test Category',
    ]);

    $response->assertRedirect('/questions');
    $this->assertDatabaseHas('questions', [
        'content' => 'Test question content here',
        'for' => 'supervisor',
    ]);
});

it('admin can update a question', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);
    $question = Question::factory()->create();

    $response = $this->actingAs($admin)->patch("/questions/{$question->id}", [
        'content' => 'Updated content',
        'for' => $question->for,
        'type' => 'text',
        'category' => 'Updated Category',
    ]);

    $response->assertRedirect('/questions');
    $this->assertDatabaseHas('questions', [
        'id' => $question->id,
        'content' => 'Updated content',
    ]);
});

it('admin can reorder questions', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);
    $q1 = Question::factory()->create(['for' => 'supervisor', 'order' => 1]);
    $q2 = Question::factory()->create(['for' => 'supervisor', 'order' => 2]);

    $response = $this->actingAs($admin)->post('/questions/reorder', [
        'questions' => [
            ['id' => $q1->id, 'order' => 2],
            ['id' => $q2->id, 'order' => 1],
        ],
    ]);

    $response->assertRedirect();
    $this->assertEquals(2, $q1->fresh()->order);
    $this->assertEquals(1, $q2->fresh()->order);
});

it('non-admin cannot access questions management', function () {
    $department = Department::create(['name' => 'Test Department']);
    $supervisor = User::factory()->create(['role' => 'supervisor', 'department_id' => $department->id]);

    $response = $this->actingAs($supervisor)->get('/questions');

    $response->assertForbidden();
});

it('validates question content is required', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);

    $response = $this->actingAs($admin)->post('/questions', [
        'content' => '',
        'for' => 'supervisor',
        'type' => 'scale',
        'category' => 'Test',
    ]);

    $response->assertSessionHasErrors('content');
});

it('validates question content minimum length', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);

    $response = $this->actingAs($admin)->post('/questions', [
        'content' => 'Short',
        'for' => 'supervisor',
        'type' => 'scale',
        'category' => 'Test',
    ]);

    $response->assertSessionHasErrors('content');
});

it('validates for field must be trainee or supervisor', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);

    $response = $this->actingAs($admin)->post('/questions', [
        'content' => 'Test question content here',
        'for' => 'invalid',
        'type' => 'scale',
        'category' => 'Test',
    ]);

    $response->assertSessionHasErrors('for');
});

it('prevents changing for field on update', function () {
    $department = Department::create(['name' => 'Test Department']);
    $admin = User::factory()->create(['role' => 'admin', 'department_id' => $department->id]);
    $question = Question::factory()->create(['for' => 'supervisor']);

    $response = $this->actingAs($admin)->patch("/questions/{$question->id}", [
        'content' => 'Updated content',
        'for' => 'trainee',
        'type' => 'scale',
        'category' => 'Test',
    ]);

    $response->assertSessionHasErrors('for');
});

it('orders questions correctly', function () {
    Question::factory()->create(['for' => 'supervisor', 'order' => 2, 'content' => 'Question 2']);
    Question::factory()->create(['for' => 'supervisor', 'order' => 1, 'content' => 'Question 1']);
    Question::factory()->create(['for' => 'supervisor', 'order' => 3, 'content' => 'Question 3']);

    $questions = Question::where('for', 'supervisor')->ordered()->get();

    expect($questions->pluck('order')->toArray())->toBe([1, 2, 3]);
});

it('groups questions by category', function () {
    Question::factory()->create(['category' => 'Cat A', 'content' => 'Question A1']);
    Question::factory()->create(['category' => 'Cat A', 'content' => 'Question A2']);
    Question::factory()->create(['category' => 'Cat B', 'content' => 'Question B1']);

    $grouped = Question::all()->groupBy('category');

    expect($grouped)->toHaveCount(2);
    expect($grouped['Cat A'])->toHaveCount(2);
    expect($grouped['Cat B'])->toHaveCount(1);
});

it('casts order to integer', function () {
    $question = Question::factory()->create(['order' => '10', 'content' => 'Test Question']);

    expect($question->order)->toBeInt();
    expect($question->order)->toBe(10);
});
