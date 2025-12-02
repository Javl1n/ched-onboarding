<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTraineeJournalRequest;
use App\Http\Requests\UpdateTraineeJournalRequest;
use App\Models\TraineeJournal;
use Illuminate\Http\Request;

class TraineeJournalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $trainee = auth()->user()->profile;

        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $journals = $trainee->journals()
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date', 'desc')
            ->get();

        return inertia()->render('journal/index', [
            'journals' => $journals,
            'month' => $month,
            'year' => $year,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia()->render('journal/create', [
            'date' => now('Asia/Manila')->format('Y-m-d'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTraineeJournalRequest $request)
    {
        $trainee = auth()->user()->profile;

        $trainee->journals()->create($request->validated());

        return redirect()->route('journal.index')->with('success', 'Journal entry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TraineeJournal $journal)
    {
        // Ensure the journal belongs to the authenticated trainee
        if ($journal->trainee_id !== auth()->user()->profile->id) {
            abort(403, 'Unauthorized access to this journal entry.');
        }

        return inertia()->render('journal/show', [
            'journal' => $journal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TraineeJournal $journal)
    {
        // Ensure the journal belongs to the authenticated trainee
        if ($journal->trainee_id !== auth()->user()->profile->id) {
            abort(403, 'Unauthorized access to this journal entry.');
        }

        return inertia()->render('journal/edit', [
            'journal' => $journal,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTraineeJournalRequest $request, TraineeJournal $journal)
    {
        // Ensure the journal belongs to the authenticated trainee
        if ($journal->trainee_id !== auth()->user()->profile->id) {
            abort(403, 'Unauthorized access to this journal entry.');
        }

        $journal->update($request->validated());

        return redirect()->route('journal.index')->with('success', 'Journal entry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TraineeJournal $journal)
    {
        // Ensure the journal belongs to the authenticated trainee
        if ($journal->trainee_id !== auth()->user()->profile->id) {
            abort(403, 'Unauthorized access to this journal entry.');
        }

        $journal->delete();

        return redirect()->route('journal.index')->with('success', 'Journal entry deleted successfully.');
    }
}
