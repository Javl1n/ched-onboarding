<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Question;
use App\Models\TraineeProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SupervisorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supervisors = User::with(['department'])->where('role', 'supervisor')->get();

        return inertia('supervisor/index', [
            "supervisors" => $supervisors,
            "departments" => Department::all()->except(
                Department::where('name', "Admin")->first()->id
            ),
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
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users,email",
            "password" => "required",
            "department" => "required|exists:departments,id"
        ]);

        $supervisor = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "department_id" => $request->department,
            "role" => "supervisor",
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(User $supervisor)
    {

        $questions = Question::where('for', 'trainee')->where('type', 'scale')->get();

        $assessments = $questions->mapWithKeys(function ($question) use ($supervisor) {
            $assessment = $supervisor->supervisorAssessments()->where('question_id', $question->id)->get();

            return [$question->id => (int) round($assessment->sum('value') / ($assessment->count() > 0 ? $assessment->count() : 1))];
        });

        return inertia()->render('supervisor/show', [
            "supervisor" => $supervisor,
            "assessments" => $assessments,
            "questions" => $questions,
            "trainees" => $supervisor->department->users()->where('role', 'trainee')->get()
        ]);
    }

    public function showTrainee(User $supervisor, User $trainee) 
    {
        $questions = Question::where('for', 'trainee')->get();

        return inertia()->render('supervisor/show-trainee', [
            "supervisor" => $supervisor,
            "trainee" => $trainee,
            "questions" => $questions,
            "assessments" => $supervisor->supervisorAssessments()->where('trainee_id', $trainee->profile->id)->with('question')->get(),
            "trainees" => $supervisor->department->users()->where('role', 'trainee')->get(),
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
