// Auth feature routes
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
    meta: {
      requiresGuest: true, // Only accessible to non-authenticated users
      title: 'Sign In'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./pages/Register.vue'),
    meta: {
      requiresGuest: true, // Only accessible to non-authenticated users
      title: 'Create Account'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('./pages/ForgotPassword.vue'),
    meta: {
      requiresGuest: true,
      title: 'Forgot Password'
    }
  },
  {
    path: '/email/verify',
    name: 'EmailVerification',
    component: () => import('./pages/EmailVerification.vue'),
    meta: {
      requiresAuth: true,
      isEmailVerification: true,
      title: 'Verify Email'
    }
  },
  {
    path: '/email/verify/:id/:hash',
    name: 'EmailVerificationLink',
    component: () => import('./pages/EmailVerification.vue'),
    meta: {
      requiresAuth: true,
      isEmailVerification: true,
      title: 'Verifying Email'
    }
  },
  {
    path: '/two-factor-authentication',
    name: 'TwoFactorAuthentication',
    component: () => import('./pages/TwoFactorAuthentication.vue'),
    meta: {
      requiresGuest: true, // Only accessible to non-authenticated users (partial auth state)
      isTwoFactorAuthentication: true,
      title: 'Two-Factor Authentication'
    }
  },
  {
    path: '/password/reset',
    name: 'PasswordReset',
    component: () => import('./pages/PasswordReset.vue'),
    meta: {
      requiresGuest: true,
      title: 'Reset Password'
    }
  }
] 