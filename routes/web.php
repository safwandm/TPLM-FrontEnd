<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\Environment\Console;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', action: function () {
//     return Inertia::render('Dashboard');
// });

Route::get('/quizzes/create', action: function () {
    return Inertia::render('Quizzes/Create');
});

Route::get('/quizzes/{id}/edit', function ($id) {
    return Inertia::render('Quizzes/Edit', [
        'id' => $id  // passed to usePage().props or usePage().params
    ]);
});

// Route::get('/quizzes/create', fn () =>
//     Inertia::render('Quizzes/Form')
// );

// // Edit
// Route::get('/quizzes/{id}/edit', fn ($id) =>
//     Inertia::render('Quizzes/Form', ['id' => $id])
// );


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::get('/login', function () {
//     return Inertia::render('Auth/Login');
// })->name('login');

Route::get('/login', fn () => Inertia::render('Login'));
Route::get('/dashboard', fn () => Inertia::render('Dashboard'));


require __DIR__.'/auth.php';