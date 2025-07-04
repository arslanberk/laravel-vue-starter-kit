<?php

use Illuminate\Support\Facades\Route;

// Catch-all route for SPA (excludes API routes)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
