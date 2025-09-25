<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\User;
use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;

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
    public function showLog(User $user)
    {
        $month = request()->input('month', now()->month);
        $year = request()->input('year', now()->year);
        
        return inertia()->render('trainee/show/log', [
            'trainee' => $user->load(['department', 'profile.logs']),
            "month" => $month,
            "year" => $year,
            "logs" => $user->profile->logs()
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get(),
            // "questions" => Question::where('for', 'supervisor')->get()
        ]);
    }

    public function showAssessment(User $user)
    {
        return inertia()->render('trainee/show/assessment', [
            'trainee' => $user->load(['department', 'profile.assessments.question']),
            "questions" => Question::where('for', 'supervisor')->get()
        ]);
    }

    public function showReport(User $user)
    {
        // dd(
        //     // calculate total hours
        //     $user->profile->logs->map(function ($log) {
        //         return $log->hours;
        //     })->sum(),
        //     // calcullate assessment score
        //     $user->profile->assessments->map(function ($assessment) {
        //         return $assessment->question->type == "scale" ? $assessment->value : 0;
        //     })->sum() / 22,
        // );


        return inertia()->render('trainee/show/reports', [
            'trainee' => $user->load(['department', 'profile']),
            'assessments' => $user->profile->assessments->load(['question']),
            'logs' => $user->profile->logs,
        ]);
    }

    public function summary (User $user)
    {
        $timelogs = $user->profile->logs;

        $totalHours = $timelogs->sum('hours');
        $daysPresent = $timelogs->count();
        $averageHours = $daysPresent ? round($totalHours / $daysPresent, 2) : 0;
        
        $responses = $user->profile->assessments->load(['question']);
        $assessmentSummary = $responses->map(function ($response) {
            return $response->question->content . ': ' . $response->value;
        })->implode("\n");

        $prompt = "
            Trainee: {$user->name}\n
            Department: {$user->department->name}\n
            \n
            --- Attendance Data ---\n
            Total Hours: {$totalHours}\n
            Days Present: {$daysPresent}\n
            Average Daily Hours: {$averageHours}\n
            Detailed Logs:
            " . $timelogs->map(fn($log) => 
                "{$log->date}: {$log->hours} hrs (In: {$log->morning_in} / Out: {$log->afternoon_out})"
            )->implode("\n") . "
            
            --- Supervisor Assessmennt ---
            {$assessmentSummary}
        "; 

        return response()->stream(function () use ($prompt) {

            $stream = Prism::text()
                ->using('openai', 'gpt-5-nano')
                ->withSystemPrompt('You are an HR assistant summarizing trainee performance. 
                              Always write in a neutral, professional tone.
                              Format the response in valid HTML with semantic tags.
                              Use <h2> for section headers and <p> for details.
                              Structure into three sections:
                              <h2>Attendance Summary</h2>
                              <h2>Supervisor Assessment</h2>
                              <h2>Overall Impression</h2>')
                ->withPrompt($prompt)
                ->withMaxTokens(10000)               
                ->asStream();

            foreach ($stream as $chunk) {
                // usleep(10 * 1000);
                yield $chunk->text;
            }

            // sleep(5);

            // foreach (explode(' ', $prompt) as $chunk) {
            //     usleep(100 * 1000);
            //     yield $chunk . ' ';
            // }

        }, 200, [
            // 'Cache-Control' => 'no-cache',
            // 'Content-Type'  => 'text/event-stream', // or text/plain depending on frontend
            // 'X-Accel-Buffering' => 'no',
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
