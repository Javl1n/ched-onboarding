<?php

use App\Models\Announcement;
use App\Models\AnnouncementNotification;
use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create departments
    $this->department1 = Department::create(['name' => 'IT Department']);
    $this->department2 = Department::create(['name' => 'HR Department']);

    // Create users
    $this->admin = User::factory()->create([
        'role' => 'admin',
        'department_id' => $this->department1->id,
    ]);

    $this->supervisor = User::factory()->create([
        'role' => 'supervisor',
        'department_id' => $this->department1->id,
    ]);

    $this->trainee = User::factory()->create([
        'role' => 'trainee',
        'department_id' => $this->department1->id,
    ]);

    $this->trainee2 = User::factory()->create([
        'role' => 'trainee',
        'department_id' => $this->department2->id,
    ]);
});

test('admin can create global announcements', function () {
    $this->actingAs($this->admin);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Global Announcement',
        'content' => 'This is a global announcement for everyone.',
        'priority' => 'normal',
        'status' => 'draft',
        'department_id' => null,
    ]);

    $response->assertRedirect('/announcements');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Global Announcement',
        'department_id' => null,
        'user_id' => $this->admin->id,
    ]);
});

test('admin can create department specific announcements', function () {
    $this->actingAs($this->admin);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Department Announcement',
        'content' => 'This is for IT department only.',
        'priority' => 'high',
        'status' => 'draft',
        'department_id' => $this->department1->id,
    ]);

    $response->assertRedirect('/announcements');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Department Announcement',
        'department_id' => $this->department1->id,
    ]);
});

test('supervisor can create department announcements only for their department', function () {
    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Supervisor Announcement',
        'content' => 'This is from a supervisor.',
        'priority' => 'normal',
        'status' => 'draft',
        'department_id' => $this->department1->id,
    ]);

    $response->assertRedirect('/announcements');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Supervisor Announcement',
        'department_id' => $this->department1->id,
        'user_id' => $this->supervisor->id,
    ]);
});

test('supervisor cannot create global announcements', function () {
    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Global Announcement',
        'content' => 'Trying to create global.',
        'priority' => 'normal',
        'status' => 'draft',
        'department_id' => null,
    ]);

    $response->assertForbidden();
});

test('supervisor cannot create announcements for other departments', function () {
    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Other Department',
        'content' => 'Trying to create for other department.',
        'priority' => 'normal',
        'status' => 'draft',
        'department_id' => $this->department2->id,
    ]);

    $response->assertForbidden();
});

test('trainee cannot access create announcement route', function () {
    $this->actingAs($this->trainee);

    $response = $this->get('/announcements/create');

    $response->assertForbidden();
});

test('trainees are notified when announcement is published', function () {
    $this->actingAs($this->admin);

    $response = $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Published Announcement',
        'content' => 'This will notify trainees.',
        'priority' => 'urgent',
        'status' => 'published',
        'department_id' => null,
    ]);

    $announcement = Announcement::where('title', 'Published Announcement')->first();

    // Check that notifications were created for all trainees
    $this->assertDatabaseHas('announcement_notifications', [
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee->id,
        'read_at' => null,
    ]);

    $this->assertDatabaseHas('announcement_notifications', [
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee2->id,
        'read_at' => null,
    ]);
});

test('only department trainees are notified for department announcements', function () {
    $this->actingAs($this->admin);

    $this->withoutMiddleware()->post('/announcements', [
        'title' => 'Department Only',
        'content' => 'Only IT department.',
        'priority' => 'normal',
        'status' => 'published',
        'department_id' => $this->department1->id,
    ]);

    $announcement = Announcement::where('title', 'Department Only')->first();

    // Check trainee1 from department1 was notified
    $this->assertDatabaseHas('announcement_notifications', [
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee->id,
    ]);

    // Check trainee2 from department2 was NOT notified
    $this->assertDatabaseMissing('announcement_notifications', [
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee2->id,
    ]);
});

test('announcements can be marked as read', function () {
    $announcement = Announcement::factory()->create([
        'status' => 'published',
        'published_at' => now(),
    ]);

    AnnouncementNotification::create([
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee->id,
        'read_at' => null,
    ]);

    $announcement->markAsReadBy($this->trainee);

    $this->assertDatabaseHas('announcement_notifications', [
        'announcement_id' => $announcement->id,
        'user_id' => $this->trainee->id,
    ]);

    $notification = AnnouncementNotification::where('announcement_id', $announcement->id)
        ->where('user_id', $this->trainee->id)
        ->first();

    expect($notification->read_at)->not->toBeNull();
});

test('republishing does not create duplicate notifications', function () {
    $this->actingAs($this->admin);

    // Create published announcement
    $announcement = Announcement::factory()->create([
        'status' => 'published',
        'published_at' => now(),
    ]);

    // Create initial notifications
    $announcement->notifyTrainees();

    $initialCount = AnnouncementNotification::where('announcement_id', $announcement->id)->count();

    // Call publish again
    $announcement->publish();

    $finalCount = AnnouncementNotification::where('announcement_id', $announcement->id)->count();

    expect($finalCount)->toBe($initialCount);
});

test('admin can update any announcement', function () {
    $announcement = Announcement::factory()->create([
        'user_id' => $this->supervisor->id,
        'title' => 'Original Title',
    ]);

    $this->actingAs($this->admin);

    $response = $this->withoutMiddleware()->patch("/announcements/{$announcement->id}", [
        'title' => 'Updated Title',
        'content' => $announcement->content,
        'priority' => $announcement->priority,
        'status' => $announcement->status,
        'department_id' => $announcement->department_id,
    ]);

    $response->assertRedirect('/announcements');

    $this->assertDatabaseHas('announcements', [
        'id' => $announcement->id,
        'title' => 'Updated Title',
    ]);
});

test('supervisor can only update their own announcements', function () {
    $otherSupervisor = User::factory()->create([
        'role' => 'supervisor',
        'department_id' => $this->department1->id,
    ]);

    $announcement = Announcement::factory()->create([
        'user_id' => $otherSupervisor->id,
    ]);

    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->patch("/announcements/{$announcement->id}", [
        'title' => 'Hacked Title',
        'content' => $announcement->content,
        'priority' => $announcement->priority,
        'status' => $announcement->status,
        'department_id' => $announcement->department_id,
    ]);

    $response->assertForbidden();
});

test('admin can delete any announcement', function () {
    $announcement = Announcement::factory()->create([
        'user_id' => $this->supervisor->id,
    ]);

    $this->actingAs($this->admin);

    $response = $this->withoutMiddleware()->delete("/announcements/{$announcement->id}");

    $response->assertRedirect('/announcements');

    $this->assertDatabaseMissing('announcements', [
        'id' => $announcement->id,
    ]);
});

test('supervisor can delete their own announcements', function () {
    $announcement = Announcement::factory()->create([
        'user_id' => $this->supervisor->id,
    ]);

    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->delete("/announcements/{$announcement->id}");

    $response->assertRedirect('/announcements');

    $this->assertDatabaseMissing('announcements', [
        'id' => $announcement->id,
    ]);
});

test('supervisor cannot delete other users announcements', function () {
    $announcement = Announcement::factory()->create([
        'user_id' => $this->admin->id,
    ]);

    $this->actingAs($this->supervisor);

    $response = $this->withoutMiddleware()->delete("/announcements/{$announcement->id}");

    $response->assertForbidden();

    $this->assertDatabaseHas('announcements', [
        'id' => $announcement->id,
    ]);
});

test('all users can view announcements index', function () {
    $this->actingAs($this->trainee);

    $response = $this->get('/announcements');

    $response->assertOk();
});

test('all users can view individual announcements', function () {
    $announcement = Announcement::factory()->create([
        'status' => 'published',
    ]);

    $this->actingAs($this->trainee);

    $response = $this->get("/announcements/{$announcement->id}");

    $response->assertOk();
});

test('announcement notifications are deleted when announcement is deleted', function () {
    $announcement = Announcement::factory()->create([
        'status' => 'published',
        'published_at' => now(),
    ]);

    $announcement->notifyTrainees();

    $this->assertDatabaseHas('announcement_notifications', [
        'announcement_id' => $announcement->id,
    ]);

    $announcement->delete();

    $this->assertDatabaseMissing('announcement_notifications', [
        'announcement_id' => $announcement->id,
    ]);
});
