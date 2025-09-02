<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\SupervisorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect('/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::controller(PageController::class)
    ->name('onboarding.')
    ->prefix('/page')->group(function () {
        Route::middleware('role:admin,supervisor')->group(function () {
            Route::post('/', 'store')->name('store');
            Route::get('/create', 'create')->name('create');
            Route::get('{page:slug}/edit', 'edit')->name('edit');
            Route::post('{page:slug}/update', 'update')->name('update');
        });
        Route::get('/', 'index')->name('index');
        Route::get('{page:slug}', 'show')->name('show');
    });

    Route::controller(SupervisorController::class)
    ->middleware('role:admin')
    ->name('supervisor.')
    ->prefix('/supervisor')
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
