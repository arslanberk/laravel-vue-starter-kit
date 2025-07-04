<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

// Import Fortify contracts for custom JSON responses
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Contracts\PasswordUpdateResponse as PasswordUpdateResponseContract;
use Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse as ProfileInformationUpdatedResponseContract;
use Laravel\Fortify\Contracts\PasswordResetResponse as PasswordResetResponseContract;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Laravel\Fortify\Contracts\PasswordConfirmedResponse as PasswordConfirmedResponseContract;
use Laravel\Fortify\Contracts\FailedPasswordConfirmationResponse as FailedPasswordConfirmationResponseContract;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

        // Disable Fortify's default routes since we define our own
        Fortify::ignoreRoutes();
        
        // Bind custom JSON response contracts
        $this->app->singleton(LoginResponseContract::class, function () {
            return new class implements LoginResponseContract {
                public function toResponse($request)
                {
                    // At this point, the user should already be authenticated by Fortify's pipeline
                    $user = auth()->user();
                    
                    if (!$user) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Authentication failed'
                        ], 401);
                    }
                    
                    return response()->json([
                        'success' => true,
                        'message' => $user->hasVerifiedEmail() 
                            ? 'Login successful' 
                            : 'Login successful. Please verify your email.',
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'email_verified_at' => $user->email_verified_at?->toISOString(),
                            'created_at' => $user->created_at?->toISOString(),
                            'two_factor_enabled' => !is_null($user->two_factor_secret),
                        ],
                        'email_verified' => $user->hasVerifiedEmail(),
                        'two_factor_enabled' => !is_null($user->two_factor_secret),
                    ]);
                }
            };
        });

        $this->app->singleton(LogoutResponseContract::class, function () {
            return new class implements LogoutResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Logged out successfully'
                    ]);
                }
            };
        });

        $this->app->singleton(RegisterResponseContract::class, function () {
            return new class implements RegisterResponseContract {
                public function toResponse($request)
                {
                    $user = auth()->user();
                    return response()->json([
                        'success' => true,
                        'message' => 'Registration successful. Please verify your email.',
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'email_verified_at' => $user->email_verified_at?->toISOString(),
                            'created_at' => $user->created_at?->toISOString(),
                            'two_factor_enabled' => !is_null($user->two_factor_secret),
                        ],
                        'email_verified' => false,
                        'two_factor_enabled' => !is_null($user->two_factor_secret),
                    ], 201);
                }
            };
        });

        $this->app->singleton(PasswordUpdateResponseContract::class, function () {
            return new class implements PasswordUpdateResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Password updated successfully'
                    ]);
                }
            };
        });

        $this->app->singleton(ProfileInformationUpdatedResponseContract::class, function () {
            return new class implements ProfileInformationUpdatedResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Profile updated successfully',
                        'user' => [
                            'id' => auth()->user()->id,
                            'name' => auth()->user()->name,
                            'email' => auth()->user()->email,
                            'email_verified_at' => auth()->user()->email_verified_at?->toISOString(),
                            'created_at' => auth()->user()->created_at?->toISOString(),
                            'two_factor_enabled' => !is_null(auth()->user()->two_factor_secret),
                        ]
                    ]);
                }
            };
        });

        $this->app->singleton(PasswordResetResponseContract::class, function () {
            return new class implements PasswordResetResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Password reset successfully'
                    ]);
                }
            };
        });

        $this->app->singleton(VerifyEmailResponseContract::class, function () {
            return new class implements VerifyEmailResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Email verified successfully'
                    ]);
                }
            };
        });

        $this->app->singleton(TwoFactorLoginResponseContract::class, function () {
            return new class implements TwoFactorLoginResponseContract {
                public function toResponse($request)
                {
                    $user = auth()->user();
                    return response()->json([
                        'success' => true,
                        'message' => 'Two-factor authentication successful',
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'email_verified_at' => $user->email_verified_at?->toISOString(),
                            'created_at' => $user->created_at?->toISOString(),
                            'two_factor_enabled' => !is_null($user->two_factor_secret),
                        ],
                        'email_verified' => $user->hasVerifiedEmail(),
                        'two_factor_enabled' => !is_null($user->two_factor_secret),
                    ]);
                }
            };
        });

        $this->app->singleton(PasswordConfirmedResponseContract::class, function () {
            return new class implements PasswordConfirmedResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => true,
                        'message' => 'Password confirmed successfully'
                    ]);
                }
            };
        });

        $this->app->singleton(FailedPasswordConfirmationResponseContract::class, function () {
            return new class implements FailedPasswordConfirmationResponseContract {
                public function toResponse($request)
                {
                    return response()->json([
                        'success' => false,
                        'message' => 'The provided password is incorrect'
                    ], 422);
                }
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        // Login rate limiter - 5 attempts per minute per IP and email combination
        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        // Two factor authentication rate limiter - 5 requests per minute per user
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        // Email verification rate limiter - 3 requests per minute per user
        RateLimiter::for('verification', function (Request $request) {
            return Limit::perMinute(3)->by($request->user()?->id ?: $request->ip());
        });

        // Override VerifyEmail notification to use frontend URL
        VerifyEmail::createUrlUsing(function ($notifiable) {
            // Generate the signed URL for the API endpoint to get proper signatures
            $apiUrl = URL::temporarySignedRoute(
                'api.auth.verification.verify',
                Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );

            // Extract the query parameters from the API URL
            $parsedUrl = parse_url($apiUrl);
            $queryParams = [];
            if (isset($parsedUrl['query'])) {
                parse_str($parsedUrl['query'], $queryParams);
            }

            // Build the frontend URL with the parameters
            $frontendUrl = config('app.url') . '/email/verify/' . $notifiable->getKey() . '/' . sha1($notifiable->getEmailForVerification());
            
            // Add query parameters to frontend URL
            if (!empty($queryParams)) {
                $frontendUrl .= '?' . http_build_query($queryParams);
            }

            return $frontendUrl;
        });

        // Override ResetPassword notification to use frontend URL
        ResetPassword::createUrlUsing(function ($notifiable, $token) {
            // Build frontend password reset URL with token and email
            $frontendUrl = config('app.url') . '/password/reset';
            
            // Add token and email as query parameters
            $queryParams = [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ];
            
            return $frontendUrl . '?' . http_build_query($queryParams);
        });
    }
}
