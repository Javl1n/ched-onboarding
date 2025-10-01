<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\TraineeAssessment;
use App\Models\TraineeReport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Return_;
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
        ]);
    }

    public function assessmentRedirect(User $user)
    {
        return redirect()->route('trainees.show.assessment', [
            "user" => $user,
            "supervisor" => $user->department->users()->where('role', 'supervisor')->first()
        ]);
    }

    public function showAssessment(User $user, User $supervisor)
    {
        return inertia()->render('trainee/show/assessment', [
            'trainee' => $user->load(['department']),
            "questions" => Question::where('for', 'supervisor')->get(),
            "supervisor" => $supervisor,
            "assessments" => $user->profile->assessments()->with('question')->where('supervisor_id', $supervisor->id)->get(),
            'supervisors' => $user->department->users()->where('role', 'supervisor')->get()
        ]);
    }

    public function showReport(User $user)
    {
        return inertia()->render('trainee/show/reports', [
            'trainee' => $user->load(['department', 'profile']),
            'assessments' => $user->profile->assessments->load(['question']),
            'logs' => $user->profile->logs,
        ]);
    }

    public function summary (User $user)
    {
        // $key = "summary:" . $user->id;

        // if (RateLimiter::tooManyAttempts($key, 3)) {
        //     return response("you've hit the maxmimum summary for this user", 429);
        // }

        // RateLimiter::hit($key, now()->addDay());

        $timelogs = $user->profile->logs;

        $totalHours = $timelogs->sum('hours');
        $daysPresent = $timelogs->count();
        $averageHours = $daysPresent ? round($totalHours / $daysPresent, 2) : 0;
        
        $responses = $user->profile->assessments->load(['question']);

        $assessmentSummary = $responses->groupBy('supervisor.name')->map(function ($responses, $key) {
            return "supervisor: {$key}\nresponses: {\n" .
                $responses->map(function ($response) {
                    return $response->question->content . ": " . $response->value;
                })->implode("\n")
            . "}";
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

    public function savedReport (User $user)
    {
        $id = request()->input("report", $user->profile->reports()->latest()->first()?->id);

        $report = TraineeReport::where('id', $id)->first()?->content ?? "";
        
        return response()->stream(function () use ($report) {
            foreach (str_split($report, 10) as $chunk) {
                usleep( 25 * 1000 );
                yield $chunk;
            }

        }, 200, [
            // 'Cache-Control' => 'no-cache',
            // 'Content-Type'  => 'text/event-stream', // or text/plain depending on frontend
            // 'X-Accel-Buffering' => 'no',
        ]);
    }

    public function storeReport(User $user, Request $request)
    {   
        $latest = $user->profile->reports()->latest()->first();

        // if ($latest && $latest->created_at->isToday()) {
        //     return back()->withErrors([
        //         "summary" => "You've already saved a prompt for today."
        //     ]);
        // }

        if ($request->summary == '') {
            return back()->withErrors([
                "summary" => "Please Enter a Prompt first."
            ]);
        }

        if ($latest && $latest->created_at->gt(Carbon::now()->subDay())) {
            $latest->update([
                'content' => $request->summary,
            ]);

            return back();
        }


        $user->profile->reports()->updateOrCreate([
            "content" => $request->summary,
        ]);

        return back();
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
