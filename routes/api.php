<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import all Fortify controllers
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;
use Laravel\Fortify\Http\Controllers\ProfileInformationController;
use Laravel\Fortify\Http\Controllers\PasswordController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController;
use Laravel\Fortify\Http\Controllers\RecoveryCodeController;
use Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\ConfirmablePasswordController;
use Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController;

/*
|--------------------------------------------------------------------------
| API Routes - Fortify Integration
|--------------------------------------------------------------------------
|
| All authentication routes use Fortify controllers directly for 
| battle-tested security and features. Routes are organized under
| /api/auth/* for clean API structure.
|
*/

// Test endpoint
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!',
        'data' => [
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ]
    ]);
});



// Authentication routes (Guest access required)
Route::middleware(['web'])->prefix('auth')->group(function () {
    
    // Basic Authentication
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('api.auth.login');
        
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('api.auth.register');
    
    // Password Reset
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('api.auth.password.email');
        
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('api.auth.password.update');
    
    // Two-Factor Authentication Challenge (for guests during login)
    Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store'])
        ->middleware(['guest:'.config('fortify.guard')])
        ->name('api.auth.two-factor.login');
});

// Authenticated routes
Route::middleware(['web', 'auth:sanctum'])->prefix('auth')->group(function () {
    
    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('api.auth.logout');
    
    // Email Verification
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['throttle:6,1'])
        ->name('api.auth.verification.send');
        
    Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('api.auth.verification.verify');
    
    // Profile Management
    Route::put('/profile', [ProfileInformationController::class, 'update'])
        ->middleware(['password.confirm'])
        ->name('api.auth.profile.update');
        
    Route::put('/password', [PasswordController::class, 'update'])
        ->middleware(['password.confirm'])
        ->name('api.auth.password.change');
    
    // Password Confirmation
    Route::get('/confirmed-password-status', [ConfirmedPasswordStatusController::class, 'show'])
        ->name('api.auth.password.confirmation.status');
        
    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->name('api.auth.password.confirm');
    
    // Two-Factor Authentication Management
    Route::post('/two-factor', [TwoFactorAuthenticationController::class, 'store'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.enable');
        
    Route::delete('/two-factor', [TwoFactorAuthenticationController::class, 'destroy'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.disable');
        
    Route::post('/two-factor/confirm', [ConfirmedTwoFactorAuthenticationController::class, 'store'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.confirm');
        
    Route::get('/two-factor/qr-code', [TwoFactorQrCodeController::class, 'show'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.qr-code');
        
    Route::get('/two-factor/secret-key', [TwoFactorSecretKeyController::class, 'show'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.secret-key');
        
    Route::get('/two-factor/recovery-codes', [RecoveryCodeController::class, 'index'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.recovery-codes');
        
    Route::post('/two-factor/recovery-codes', [RecoveryCodeController::class, 'store'])
        ->middleware(['password.confirm'])
        ->name('api.auth.two-factor.recovery-codes.regenerate');
});

// Protected API routes (require authentication)
Route::middleware(['web', 'auth:sanctum'])->prefix('v1')->group(function () {
    // User status endpoint
    Route::get('/user', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'created_at' => $user->created_at?->toISOString(),
                'two_factor_enabled' => !is_null($user->two_factor_secret),
            ],
            'email_verified' => !is_null($user->email_verified_at),
            'two_factor_enabled' => !is_null($user->two_factor_secret),
        ]);
    })->name('api.user');
    
    // Future protected API endpoints
});


