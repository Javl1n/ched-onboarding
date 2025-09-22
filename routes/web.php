<?php 
use App\Http\Controllers\SupervisorAssessmentController;
?><?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TraineeController;


Route::get('/', function () {
    return redirect('/login');
})->name('redirect');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(DashboardController::class)->prefix("dashboard")->name("dashboard.")->group(function () {

        Route::get('/', 'index')->name('index');
        Route::get('admin', 'admin')->middleware('role:admin')->name('admin');
        Route::get('supervisor', 'supervisor')->middleware('role:supervisor')->name('supervisor');
        Route::get('trainee', 'trainee')->middleware(['role:trainee', 'profiled'])->name('trainee');

    });

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

    Route::controller(DepartmentController::class)
    ->middleware('role:admin')
    ->name('department.')
    ->prefix('/department')
    ->group(function () {

        Route::post('/', 'store')->name('store');
        
    });

    Route::controller(TimeLogController::class)
    ->group(function () {
        Route::middleware(['role:admin'])->group(function () {
            
            Route::post('/time-log', 'store')->name('timelog.post');
            
        });
    });

    Route::prefix('/assessments')
    ->name('assessments.')
    ->group(function () {

        Route::prefix('/supervisor')->name('supervisor.')
        ->controller(SupervisorAssessmentController::class)->group(function () {
            
            Route::post('/{trainee}', 'store')->name('store');

        });

    });

    Route::prefix('/trainees')
    ->middleware('role:admin,supervisor')
    ->controller(TraineeController::class)
    ->name('trainees.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{user}/logs', 'showLog')->name('show.log');
        Route::get('/{user}/assesssment', 'showAssessment')->name('show.assessment');
        Route::get('/{user}/report', 'showReport')->name('show.report');
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
