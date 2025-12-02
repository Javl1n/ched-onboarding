<?php

namespace App\Http\Controllers;

use App\Models\TraineeAssessment;
use App\Models\User;
use Illuminate\Http\Request;

class TraineeAssessmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(User $trainee, User $supervisor, Request $request)
    {
        if (auth()->user()->id != $supervisor->id) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'questions.*' => 'required',
        ], messages: [
            'questions.*' => [
                'required' => 'This field is required.',
            ],
        ]);

        $questions = $request->questions;

        foreach ($questions as $id => $value) {
            TraineeAssessment::updateOrCreate([
                'trainee_id' => $trainee->profile->id,
                'question_id' => $id,
                'supervisor_id' => auth()->user()->id,
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
