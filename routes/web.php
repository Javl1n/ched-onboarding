<?php

use App\Http\Controllers\PageController;
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
    ->name('pages.')
    ->prefix('/page')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{slug}', 'show')->name('show');
        Route::get('/create', 'create')->name('create');
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
