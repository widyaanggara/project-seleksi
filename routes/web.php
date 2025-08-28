<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoryController;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'stories' => \App\Models\Story::latest()->get(),
        'isAdmin' => session('is_admin') ?? false,
    ]);
})->name('stories.index');

Route::post('/stories', [StoryController::class, 'store'])->name('stories.store');
Route::post('/stories/{story}/like', [StoryController::class, 'like'])->name('stories.like');

// 🔑 Admin Login
Route::post('/admin/login', function (Request $request) {
    $username = $request->input('username');
    $password = $request->input('password');

    if ($username === 'admin' && $password === 'admin123') {
        session(['is_admin' => true]); 
        return redirect('/admin');
    }

    return back()->withErrors(['login' => 'Invalid credentials']);
})->name('admin.login');

// Admin Page
Route::get('/admin', function () {
    if (!session('is_admin')) {
        return redirect('/'); 
    }
    return Inertia::render('Admin', [
        'stories' => \App\Models\Story::latest()->get(),
    ]);
})->name('admin.page');

// 🗑️ Hapus story (khusus admin)
Route::delete('/admin/stories/{story}', [StoryController::class, 'destroy'])->name('admin.stories.destroy');

// 🚪 Logout admin
Route::post('/logout', function () {
    session()->forget('is_admin'); // hapus session is_admin
    return redirect('/');           // redirect ke home
})->name('admin.logout');