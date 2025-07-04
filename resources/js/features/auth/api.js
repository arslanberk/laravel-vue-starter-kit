import { api } from '@/shared/lib/api'

// Auth API calls - Laravel Sanctum SPA authentication with Fortify
// CSRF protection is automatically handled by shared API interceptor
export const authApi = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', {
      ...credentials,
      remember: true  // Always use remember me for persistent sessions
    })
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      ...userData,
      remember: true  // Always use remember me for persistent sessions
    })
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get current user status
  user: async () => {
    const response = await api.get('/v1/user')
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData)
    return response.data
  },

  // Verify email
  verifyEmail: async (id, hash, queryParams = {}) => {
    // Build query string from the URL parameters (expires, signature)
    const searchParams = new URLSearchParams(queryParams)
    const queryString = searchParams.toString()
    const url = `/auth/email/verify/${id}/${hash}${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url)
    return response.data
  },

  // Resend email verification
  resendEmailVerification: async () => {
    const response = await api.post('/auth/email/verification-notification')
    return response.data
  },

  // Two-factor authentication endpoints
  twoFactor: {
    // Enable 2FA
    enable: async () => {
      const response = await api.post('/auth/two-factor')
      return response.data
    },

    // Disable 2FA
    disable: async () => {
      const response = await api.delete('/auth/two-factor')
      return response.data
    },

    // Confirm 2FA setup
    confirm: async (code) => {
      const response = await api.post('/auth/two-factor/confirm', { code })
      return response.data
    },

    // Get QR code
    getQrCode: async () => {
      const response = await api.get('/auth/two-factor/qr-code')
      return response.data
    },

    // Get secret key
    getSecretKey: async () => {
      const response = await api.get('/auth/two-factor/secret-key')
      return response.data
    },

    // Get recovery codes
    getRecoveryCodes: async () => {
      const response = await api.get('/auth/two-factor/recovery-codes')
      return response.data
    },

    // Regenerate recovery codes
    regenerateRecoveryCodes: async () => {
      // First, regenerate the codes (this only triggers regeneration)
      await api.post('/auth/two-factor/recovery-codes')
      
      // Then, fetch the newly generated codes
      const response = await api.get('/auth/two-factor/recovery-codes')
      return response.data
    },
    
    // Two-factor authentication challenge
    challenge: async (code) => {
      const response = await api.post('/auth/two-factor-challenge', { code })
      return response.data
    }
  },

  // Profile management
  profile: {
    // Update profile information
    update: async (profileData) => {
      const response = await api.put('/auth/profile', profileData)
      return response.data
    },

    // Change password
    changePassword: async (passwordData) => {
      const response = await api.put('/auth/password', passwordData)
      return response.data
    }
  },

  // Password confirmation for sensitive operations
  passwordConfirmation: {
    // Check if password has been confirmed recently
    getStatus: async () => {
      const response = await api.get('/auth/confirmed-password-status')
      return response.data
    },

    // Confirm password for sensitive operations
    confirm: async (password) => {
      const response = await api.post('/auth/confirm-password', { password })
      return response.data
    }
  }
}

// Clean Laravel Sanctum SPA authentication implementation
// CSRF protection is automatically handled by the shared API layer
// No manual CSRF calls needed - everything is handled seamlessly 