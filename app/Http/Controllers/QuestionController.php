<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReorderQuestionsRequest;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $supervisorQuestions = Question::where('for', 'supervisor')
            ->ordered()
            ->get()
            ->groupBy('category');

        $traineeQuestions = Question::where('for', 'trainee')
            ->ordered()
            ->get()
            ->groupBy('category');

        return inertia()->render('questions/index', [
            'supervisorQuestions' => $supervisorQuestions,
            'traineeQuestions' => $traineeQuestions,
            'categories' => $this->getUniqueCategories(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request)
    {
        $data = $request->validated();

        // Set order to last position for this 'for' type
        $maxOrder = Question::where('for', $data['for'])->max('order') ?? 0;
        $data['order'] = $maxOrder + 1;

        Question::create($data);

        return redirect()->route('questions.index')
            ->with('success', 'Question created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        return inertia()->render('questions/edit', [
            'question' => $question,
            'categories' => $this->getUniqueCategories(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $question->update($request->validated());

        return redirect()->route('questions.index')
            ->with('success', 'Question updated successfully.');
    }

    /**
     * Reorder questions.
     */
    public function reorder(ReorderQuestionsRequest $request)
    {
        $questions = $request->validated()['questions'];

        foreach ($questions as $questionData) {
            Question::where('id', $questionData['id'])
                ->update(['order' => $questionData['order']]);
        }

        return back()->with('success', 'Questions reordered successfully.');
    }

    /**
     * Get unique categories from all questions.
     */
    private function getUniqueCategories(): array
    {
        return Question::distinct()
            ->pluck('category')
            ->sort()
            ->values()
            ->toArray();
    }
}
