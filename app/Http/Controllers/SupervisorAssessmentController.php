<?php

namespace App\Http\Controllers;

use App\Models\TraineeAssessment;
use App\Models\TraineeProfile;
use Illuminate\Http\Request;

class SupervisorAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia()->render('assessment/supervisor/index');
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
    public function store(TraineeProfile $trainee, Request $request)
    {
        $request->validate([
            'questions.*' => 'required'
        ]);

        $questions = $request->questions;

        foreach ($questions as $question) {
            TraineeAssessment::updateOrCreate([
                'trainee_id' => $trainee->id,
                'question_id' => $question['id'],
            ], [
                'supervisor_id' => auth()->user()->id,
                'value' => $question['value'],
            ]); 
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
