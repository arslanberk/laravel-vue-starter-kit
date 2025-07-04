import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const isAuthChecked = ref(false) // Track if initial auth check was performed
  const requiresTwoFactor = ref(false) // Track if 2FA is required for current login

  // Getters (computed)
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => !!user.value?.email_verified_at)
  const isTwoFactorEnabled = computed(() => !!user.value?.two_factor_enabled)

  // Actions
  const clearError = () => {
    error.value = null
  }

  const checkAuth = async () => {
    if (isLoading.value) return // Prevent multiple concurrent calls

    isLoading.value = true
    error.value = null
    
    try {
      const response = await authApi.user()
      user.value = response.user
      
      // Clear 2FA requirement if user is successfully authenticated
      // This handles the case where 2FA was completed and user is now fully authenticated
      requiresTwoFactor.value = false
      
      return response.user
    } catch (err) {
      // If unauthorized, clear user data
      if (err.response?.status === 401) {
        user.value = null
        requiresTwoFactor.value = false // Clear 2FA requirement on auth failure
      } else {
        // For other errors, don't clear user data immediately
        // This helps handle temporary network issues
        console.warn('Auth check failed (non-401 error):', err.message)
      }
      error.value = err.response?.data?.message || err.message || 'Authentication check failed'
      throw err
    } finally {
      isLoading.value = false
      isAuthChecked.value = true // Mark that auth check was performed
    }
  }

  const initializeAuth = async () => {
    if (isAuthChecked.value) return // Only check once per app session

    try {
      await checkAuth()
    } catch (err) {
      // Silently handle auth check failures on app initialization
      // This is expected for users who aren't logged in or have network issues
      // Initial auth check failed silently (user not logged in)
      
      // Clear any error that was set during auth check
      // This prevents showing "Unauthenticated" errors on login/register pages
      error.value = null
      
      // Ensure user is cleared for 401 errors
      if (err.response?.status === 401) {
        user.value = null
      }
    }
  }

  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Login request (Laravel Fortify handles this and logs user in automatically)
      // CSRF protection is automatically handled by API layer
      const loginResponse = await authApi.login(credentials)
      
      // Check if 2FA is required
      if (loginResponse.two_factor) {
        requiresTwoFactor.value = true
        user.value = null // Keep user null until 2FA is completed
        return { requiresTwoFactor: true }
      }
      
      // Normal login - use the user data from login response
      user.value = loginResponse.user
      requiresTwoFactor.value = false
      
      return loginResponse.user
    } catch (err) {
      user.value = null
      requiresTwoFactor.value = false
      
      // Handle different error types
      if (err.response?.status === 422) {
        // Validation errors
        error.value = 'Please check your email and password'
      } else if (err.response?.status === 401) {
        // Invalid credentials
        error.value = 'Invalid email or password'
      } else {
        // Generic error
        error.value = err.response?.data?.message || err.message || 'Login failed'
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await authApi.logout()
    } catch (err) {
      // Even if logout fails, clear local user data
      error.value = err.response?.data?.message || err.message || 'Logout failed'
      console.warn('Logout API failed:', err.message)
    } finally {
      // Always clear user data and reset auth state
      user.value = null
      requiresTwoFactor.value = false // Clear 2FA requirement
      // Don't reset isAuthChecked - we still know the auth state (user is not authenticated)
      // Resetting it would cause router guard to wait indefinitely
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Register request (Laravel Fortify handles this and logs user in automatically)
      // CSRF protection is automatically handled by API layer
      const registrationResponse = await authApi.register(userData)
      
      // Use the user data from registration response (user is already logged in by Fortify)
      user.value = registrationResponse.user
      
      return registrationResponse.user
    } catch (err) {
      user.value = null
      
      // Handle validation errors
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors
        if (validationErrors) {
          // Format validation errors for display
          const errorMessages = Object.values(validationErrors).flat()
          error.value = errorMessages.join(', ')
        } else {
          error.value = 'Please check your information and try again'
        }
      } else {
        error.value = err.response?.data?.message || err.message || 'Registration failed'
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    isAuthChecked,
    requiresTwoFactor,
    
    // Getters
    isAuthenticated,
    isEmailVerified,
    isTwoFactorEnabled,
    
    // Actions
    clearError,
    checkAuth,
    initializeAuth,
    login,
    logout,
    register
  }
}) 