<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TraineeProfilingController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/profiling', [
            'schools' => School::all(),
        ]);
    }
}
