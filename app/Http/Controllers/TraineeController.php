<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\TraineeReport;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Prism\Prism\Prism;

class TraineeController extends Controller
{
    protected function trainees(?string $search = null, ?string $status = null)
    {
        $query = User::where('role', 'trainee');

        // Role-based filtering
        if (auth()->user()->role === 'supervisor') {
            $query->where('department_id', auth()->user()->department_id);
        }

        // Status filtering
        if ($status === 'inactive') {
            $query->whereHas('profile', function ($query) {
                $query->where('status', 'inactive');
            });
        } elseif ($status === 'all') {
            // Show both active and inactive
            $query->whereHas('profile');
        } else {
            // Default to active only
            $query->whereHas('profile', function ($query) {
                $query->where('status', 'active');
            });
        }

        // Search filtering
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('department', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('profile', function ($q) use ($search) {
                        $q->where('school', 'like', "%{$search}%")
                            ->orWhere('contact', 'like', "%{$search}%")
                            ->orWhere('gender', 'like', "%{$search}%");
                    });
            });
        }

        return $query->with(['department', 'profile'])->paginate(15);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return inertia()->render('trainee/index', [
            'trainees' => $this->trainees(
                $request->input('search'),
                $request->input('status', 'active')
            ),
            'filters' => [
                'search' => $request->input('search'),
                'status' => $request->input('status', 'active'),
            ],
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
            'month' => $month,
            'year' => $year,
            'logs' => $user->profile->logs()
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get(),
        ]);
    }

    public function assessmentRedirect(User $user)
    {
        $supervisor = $user->department->users()->where('role', 'supervisor')->first();

        if ($supervisor) {
            $supervisor = auth()->user()->roleIs('supervisor') ? auth()->user() : $supervisor;

            return redirect()->route('trainees.show.assessment', [
                'user' => $user,
                'supervisor' => $supervisor,
            ]);
        }

        return redirect()->route('trainees.assessment.empty', [
            'user' => $user,
        ]);
    }

    public function assessmentEmpty(User $user)
    {
        return inertia()->render('trainee/show/assessment-empty', [
            'trainee' => $user->load(['department']),
        ]);
    }

    public function showAssessment(User $user, User $supervisor)
    {

        return inertia()->render('trainee/show/assessment', [
            'trainee' => $user->load(['department']),
            'questions' => Question::where('for', 'supervisor')->get(),
            'supervisor' => $supervisor,
            'assessments' => $user->profile->assessments()->with('question')->where('supervisor_id', $supervisor->id)->get(),

            'supervisors' => auth()->user()->roleIs('admin') ? $user->department->users()->where('role', 'supervisor')->get() : collect([$supervisor]),
        ]);
    }

    public function showReport(User $user)
    {
        $reports = $user->profile->reports->mapWithKeys(fn ($report) => [$report->id => $report->created_at->isoFormat('MMMM D, Y')]);

        return inertia()->render('trainee/show/reports', [
            'trainee' => $user->load(['department', 'profile']),
            'assessments' => $user->profile->assessments->load(['question']),
            'reports' => $reports->isEmpty() ? null : $reports,
            'logs' => $user->profile->logs,
        ]);
    }

    public function summary(User $user)
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
            return "supervisor: {$key}\nresponses: {\n".
                $responses->map(function ($response) {
                    return $response->question->content.': '.$response->value;
                })->implode("\n")
            .'}';
        })->implode("\n");

        $journals = $user->profile->journals()->orderBy('date', 'desc')->get();

        $journalSummary = $journals->isEmpty() ? 'No journal entries recorded.' : $journals->map(fn ($journal) => "{$journal->date}: {$journal->content}")->implode("\n\n");

        $prompt = "
            Trainee: {$user->name}\n
            Department: {$user->department->name}\n
            \n
            --- Attendance Data ---\n
            Total Hours: {$totalHours}\n
            Days Present: {$daysPresent}\n
            Average Daily Hours: {$averageHours}\n
            Detailed Logs:
            ".$timelogs->map(fn ($log) => "{$log->date}: {$log->hours} hrs (In: {$log->morning_in} / Out: {$log->afternoon_out})"
        )->implode("\n")."

            --- Supervisor Assessmennt ---
            {$assessmentSummary}

            --- Journal Entries ---
            {$journalSummary}
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
            // ob_start();
            foreach ($stream as $chunk) {
                // yield $chunk->text;
                echo $chunk->text;

                // Safe flush
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
            }
            // ob_end_flush();
        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'X-Accel-Buffering' => 'no',
        ]);

    }

    public function savedReport(User $user, Request $request)
    {

        $report = TraineeReport::where('id', $request->id)->first()?->content ?? '';

        sleep(1);

        return response()->stream(function () use ($report) {
            foreach (str_split($report, 10) as $chunk) {
                echo $chunk;
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
                usleep(10 * 1000);
            }
        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'X-Accel-Buffering' => 'no',
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
                'summary' => 'Please Enter a Prompt first.',
            ]);
        }

        if ($latest && $latest->created_at->gt(Carbon::now()->subDay())) {
            $latest->update([
                'content' => $request->summary,
            ]);

            return back();
        }

        $user->profile->reports()->updateOrCreate([
            'content' => $request->summary,
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
    public function update(Request $request) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Toggle trainee status between active and inactive.
     */
    public function toggleStatus(User $user)
    {
        // Ensure the user is a trainee
        if ($user->role !== 'trainee' || ! $user->profile) {
            abort(404, 'Trainee not found.');
        }

        // Toggle status
        if ($user->profile->status === 'active') {
            $user->profile->deactivate();
            $message = 'Trainee marked as inactive.';
        } else {
            $user->profile->reactivate();
            $message = 'Trainee reactivated.';
        }

        return back()->with('success', $message);
    }
}
