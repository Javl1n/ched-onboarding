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
        $logs = TimeLog::where('date', $date)->get();
                
        return inertia()->render('dashboard/admin', [
            "logs" => $logs
        ]);
    }

    public function supervisor()
    {
        return inertia()->render('dashboard/supervisor');
    }
    
    public function trainee()
    {
        return inertia()->render('dashboard/trainee');
    }
}