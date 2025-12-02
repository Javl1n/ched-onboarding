<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\SupervisorAssessment;
use App\Models\User;
use Illuminate\Http\Request;

class SupervisorAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supervisor = auth()->user()->department->users()->where('role', 'supervisor')->first();

        if ($supervisor) {
            return redirect()->route('assessments.supervisor.show', [
                'supervisor' => $supervisor,
            ]);
        }

        return inertia()->render('assessment/supervisor/empty');
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
    public function store(User $supervisor, Request $request)
    {
        $request->validate([
            'questions.*' => 'required',
        ], messages: [
            'questions.*' => [
                'required' => 'This field is required.',
            ],
        ]);

        $questions = $request->questions;

        foreach ($questions as $id => $value) {
            SupervisorAssessment::updateOrCreate([
                'trainee_id' => auth()->user()->profile->id,
                'question_id' => $id,
                'supervisor_id' => $supervisor->id,
            ], [
                'value' => $value,
            ]);
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $supervisors = auth()->user()->department->users()->where('role', 'supervisor')->get();

        $questions = Question::where('for', 'trainee')->get();

        $assessments = $supervisors->find($id)->supervisorAssessments()->with('question')->where('trainee_id', auth()->user()->profile->id)->get();

        return inertia()->render('assessment/supervisor/show', [
            'supervisors' => $supervisors,
            'supervisor' => $supervisors->find($id),
            'questions' => $questions,
            'assessments' => $assessments,
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
