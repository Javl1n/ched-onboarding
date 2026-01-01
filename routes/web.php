<?php
use App\Http\Controllers\SupervisorAssessmentController;

?><?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\TimeLogController;
use App\Http\Controllers\TraineeAssessmentController;
use App\Http\Controllers\TraineeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::controller(DashboardController::class)->prefix('dashboard')->name('dashboard.')->group(function () {

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
            Route::get('/{supervisor}', 'show')->name('show.all');
            Route::get('/{supervisor}/trainee/{trainee}', 'showTrainee')->name('show.trainee');

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
                ->middleware('role:trainee')
                ->controller(SupervisorAssessmentController::class)->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/{supervisor}', 'show')->name('show');
                    Route::post('/{supervisor}', 'store')->name('store');
                });

            Route::prefix('/trainee')->name('trainee.')
                ->middleware('role:supervisor')
                ->controller(TraineeAssessmentController::class)->group(function () {
                    Route::post('/{trainee}/supervisor/{supervisor}', 'store')->name('store');
                });
        });

    Route::prefix('/trainees')
        ->middleware('role:admin,supervisor')
        ->controller(TraineeController::class)
        ->name('trainees.')->group(function () {
            Route::get('/', 'index')->name('index');

            // Admin-only routes
            Route::middleware('role:admin')->group(function () {
                Route::patch('/{user}/toggle-status', 'toggleStatus')->name('toggle-status');
            });

            Route::get('/{user}/logs', 'showLog')->name('show.log');

            Route::get('/{user}/assessment', 'assessmentRedirect')->name('assessment.redirect');
            Route::get('/{user}/assessment/empty', 'assessmentEmpty')->name('assessment.empty');
            Route::get('/{user}/assessment/supervisor/{supervisor}', 'showAssessment')->name('show.assessment');

            Route::get('/{user}/report', 'showReport')->name('show.report');
            Route::get('/{user}/journal', 'showJournal')->name('show.journal');

            Route::post('/{user}/report/summary', 'summary')->name('summary');
            Route::post('/{user}/report/summary/saved', 'savedReport')->name('summary.saved');
            Route::post('/{user}/summary/store', 'storeReport')->name('summary.store');
        });

    Route::prefix('/journal')
        ->middleware(['role:trainee', 'profiled'])
        ->controller(\App\Http\Controllers\TraineeJournalController::class)
        ->name('journal.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('/{journal}', 'show')->name('show');
            Route::get('/{journal}/edit', 'edit')->name('edit');
            Route::patch('/{journal}', 'update')->name('update');
            Route::delete('/{journal}', 'destroy')->name('destroy');
        });

    Route::prefix('/announcements')
        ->controller(\App\Http\Controllers\AnnouncementController::class)
        ->name('announcements.')->group(function () {
            // View routes (all authenticated users)
            Route::get('/', 'index')->name('index');

            // Management routes (admin/supervisor only)
            Route::middleware('role:admin,supervisor')->group(function () {
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{announcement}/edit', 'edit')->name('edit');
                Route::patch('/{announcement}', 'update')->name('update');
                Route::delete('/{announcement}', 'destroy')->name('destroy');
            });

            // Must be last to avoid matching 'create' or 'edit' as IDs
            Route::get('/{announcement}', 'show')->name('show');
        });

    Route::prefix('/questions')
        ->middleware('role:admin')
        ->controller(\App\Http\Controllers\QuestionController::class)
        ->name('questions.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::get('/{question}/edit', 'edit')->name('edit');
            Route::patch('/{question}', 'update')->name('update');
            Route::post('/reorder', 'reorder')->name('reorder');
        });
});

Route::post('trainees/{user}/report/summary/test', [TraineeController::class, 'summary']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
