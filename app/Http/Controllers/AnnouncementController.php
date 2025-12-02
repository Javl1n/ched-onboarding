<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Models\Department;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Announcement::with(['user', 'department'])
            ->forUser(auth()->user());

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        $announcements = $query->latest('published_at')
            ->latest('created_at')
            ->paginate(15);

        // Append is_read property for trainees
        if (auth()->user()->role === 'trainee') {
            $announcements->each(function ($announcement) {
                $announcement->is_read = $announcement->isReadBy(auth()->user());
            });
        }

        return inertia()->render('announcements/index', [
            'announcements' => $announcements,
            'filters' => [
                'status' => $request->status,
                'priority' => $request->priority,
                'department_id' => $request->department_id,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        return inertia()->render('announcements/create', [
            'departments' => $user->role === 'admin' ? Department::all() : null,
            'userDepartmentId' => $user->department_id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnnouncementRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        $announcement = Announcement::create($data);

        if ($announcement->status === 'published') {
            $announcement->publish();
        }

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement)
    {
        $announcement->load(['user', 'department']);

        // Mark as read for trainees
        if (auth()->user()->role === 'trainee') {
            $announcement->markAsReadBy(auth()->user());
        }

        return inertia()->render('announcements/show', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Announcement $announcement)
    {
        $user = auth()->user();

        // Authorization check
        if ($announcement->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Unauthorized to edit this announcement.');
        }

        return inertia()->render('announcements/edit', [
            'announcement' => $announcement->load('department'),
            'departments' => $user->role === 'admin' ? Department::all() : null,
            'userDepartmentId' => $user->department_id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $oldStatus = $announcement->status;
        $data = $request->validated();

        $announcement->update($data);

        // If status changed from draft to published, trigger notifications
        if ($oldStatus === 'draft' && $data['status'] === 'published') {
            $announcement->publish();
        }

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        $user = auth()->user();

        // Authorization check
        if ($announcement->user_id !== $user->id && $user->role !== 'admin') {
            abort(403, 'Unauthorized to delete this announcement.');
        }

        $announcement->delete();

        return redirect()->route('announcements.index')
            ->with('success', 'Announcement deleted successfully.');
    }
}
