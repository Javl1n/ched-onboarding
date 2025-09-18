<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;

class TraineeController extends Controller
{
    protected function trainees() {
        if (auth()->user()->role === "admin") {
            return User::where('role', 'trainee')->with(['department', 'profile'])->get();
        }

        if (auth()->user()->role === "supervisor") {
            return User::where('role', 'trainee')
                ->where('department_id', auth()->user()->department_id)
                ->with(['department', 'profile'])
                ->get();
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia()->render('trainee/index', [
            'trainees' => $this->trainees()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    } 

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $month = request()->input('month', now()->month);
        $year = request()->input('year', now()->year);

        return inertia()->render('trainee/show', [
            'trainee' => $user->load(['department', 'profile']),
            "month" => $month,
            "year" => $year,
            "logs" => $user->profile->logs()
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get(),
            "questions" => Question::where('for', 'supervisor')->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
