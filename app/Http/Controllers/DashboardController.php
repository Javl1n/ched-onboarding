<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\TimeLog;
use App\Models\TraineeProfile;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        switch (auth()->user()->role) {
            case 'admin':
                return redirect()->route('dashboard.admin');
            case 'trainee':
                return redirect()->route('dashboard.trainee');
            case 'supervisor':
                return redirect()->route('dashboard.supervisor');
        }
    }

    public function admin()
    {
        $date = request()->input('date', Carbon::now()->setTimezone('Asia/Manila')->format('Y-m-d'));
        $logs = TimeLog::with(['trainee.user.department'])->where('date', $date)->get();

        // Only count active trainees
        $totalTrainees = TraineeProfile::where('status', 'active')->count();
        $presentCount = $logs->count();
        $absentCount = $totalTrainees - $presentCount;

        // Get all departments except "Admin"
        $allDepartments = Department::where('name', '!=', 'Admin')->pluck('name')->toArray();

        return inertia()->render('dashboard/admin', [
            'logs' => $logs,
            'date' => $date,
            'totalTrainees' => $totalTrainees,
            'presentCount' => $presentCount,
            'absentCount' => $absentCount,
            'allDepartments' => $allDepartments,
        ]);
    }

    public function supervisor()
    {
        $date = request()->input('date', Carbon::now()->format('Y-m-d'));

        $departmentId = auth()->user()->department_id;
        $logs = TimeLog::with(['trainee.user.department'])->whereHas('trainee.user', function ($query) use ($departmentId) {
            // $query->whereHas('user', function ($query) use ($departmentId) {
            $query->where('department_id', $departmentId);
            // });
        })->where('date', $date)->get();

        // Only count active trainees in this department
        $totalTrainees = TraineeProfile::whereHas('user', function ($query) use ($departmentId) {
            $query->where('role', 'trainee')
                ->where('department_id', $departmentId);
        })->where('status', 'active')->count();

        $presentCount = $logs->count();
        $absentCount = $totalTrainees - $presentCount;

        return inertia()->render('dashboard/supervisor', [
            'logs' => $logs,
            'date' => $date,
            'totalTrainees' => $totalTrainees,
            'presentCount' => $presentCount,
            'absentCount' => $absentCount,
        ]);
    }

    public function trainee()
    {
        $month = request()->input('month', now()->month);
        $year = request()->input('year', now()->year);

        $logs = auth()->user()->profile->logs()
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();

        return inertia()->render('dashboard/trainee', [
            'logs' => $logs,
            'month' => $month,
            'year' => $year,
            'profile' => auth()->user()->profile->profile,
            'total' => auth()->user()->profile->logs->sum(fn ($log) => $log->hours),
            'totalThisMonth' => $logs->sum(fn ($log) => $log->hours),
        ]);
    }
}
