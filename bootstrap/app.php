<?php

use App\Http\Middleware\EnsureTraineeHasNoProfile;
use App\Http\Middleware\EnsureTraineeHasProfile;
use App\Http\Middleware\EnsureUserRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Session\TokenMismatchException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserRole::class,
            'profiled' => EnsureTraineeHasProfile::class,
            'no-profile' => EnsureTraineeHasNoProfile::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(fn (TokenMismatchException $e) => response()->json([
            'message' => 'Your session has expired. Please refresh the page and try again.',
            'error' => 'CSRF token mismatch',
        ], 419));
    })->create();
