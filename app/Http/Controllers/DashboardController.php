<?php

namespace App\Http\Controllers;

use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        switch(auth()->user()->role) {
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
        $date = request()->input('date', Carbon::now()->setTimezone('Asia/Manila')->format("Y-m-d"));
        $logs = TimeLog::with(['trainee.user'])->where('date', $date)->get();
            
        return inertia()->render('dashboard/admin', [
            "logs" => $logs,
            "date" => $date,
        ]);
    }

    public function supervisor()
    {
        $date = request()->input('date', Carbon::now()->format("Y-m-d"));

        $departmentId = auth()->user()->department_id;
        $logs = TimeLog::with(['trainee.user'])->whereHas('trainee.user', function ($query) use ($departmentId) {
            // $query->whereHas('user', function ($query) use ($departmentId) {
                $query->where('department_id', $departmentId);
            // });
        })->where('date', $date)->get();

        return inertia()->render('dashboard/supervisor', [
            "logs" => $logs,
            "date" => $date
        ]);
    }
    
    public function trainee()
    {
        $month = request()->input('month', now()->month );
        $year = request()->input('year', now()->year);

        $logs = auth()->user()->profile->logs()
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();


        return inertia()->render('dashboard/trainee', [
            "logs" => $logs,
            "month" => $month,
            "year" => $year,
            "profile" => auth()->user()->profile->profile,
        ]);
    }
}