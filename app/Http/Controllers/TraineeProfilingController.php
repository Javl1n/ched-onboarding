<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TraineeProfilingController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/profiling', [
            'schools' => School::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            "profile" => 'required|file|mimes:png,jpg',
            "school" => 'required|string',
            "birth" => 'required|date',
            "gender" => 'required|in:Male,Female',
            "contact" => 'required|numeric|digits:10',
            "address" => 'required|string'
        ]);

        $user = auth()->user();

        $user->profile()->create([
            "profile" => $request->file('profile')->store('profiling/' . $user->id),
            "school" => $request->school,
            "birth" => $request->birth,
            "gender" => $request->gender,
            "contact" => $request->contact,
            "address" => $request->address
        ]);

        return redirect()->route('dashboard.trainee');
    }

    public function update(Request $request) 
    {
        $rules = [
            // "profile" => 'required|file|mimes:png,jpg',
            "school" => 'required|string',
            "birth" => 'required|date',
            "gender" => 'required|in:Male,Female',
            "contact" => 'required|numeric|digits:10',
            "address" => 'required|string'
        ];

        if ($request->hasFile('profile')) {
            $rules['profile'] = 'required|file|mimes:png,jpg';
        }

        $request->validate($rules);

        if ($request->hasFile('profile')) {
            Storage::deleteDirectory('profiling/' . auth()->user()->id);

            auth()->user()->profile()->update([
                "profile" => $request->file('profile')->store('profiling/' . auth()->user()->id),
            ]);
        }

        auth()->user()->profile()->update([
            "school" => $request->school,
            "birth" => $request->birth,
            "gender" => $request->gender,
            "contact" => $request->contact,
            "address" => $request->address
        ]);


        return back();
    }
}
