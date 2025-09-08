<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTraineeHasNoProfile
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->role == 'trainee') {
            if ($request->user()->profile) {
                return redirect()->route('dashboard.trainee');
            }

            return $next($request);
        }

        abort(403, 'Unauthorized action.');

    }
}
