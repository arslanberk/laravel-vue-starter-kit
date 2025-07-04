import axios from 'axios'
import { showPasswordConfirmation } from '@/features/auth/composables/usePasswordConfirmation'

// Create axios instance with default config for Laravel Sanctum SPA authentication
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,    // Essential for Sanctum SPA auth
  withXSRFToken: true,     // Axios automatically handles XSRF-TOKEN cookie
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Export CSRF function for manual use if needed (rare cases)
export const getCsrfCookie = async () => {
  return axios.get('/sanctum/csrf-cookie', { withCredentials: true, withXSRFToken: true })
}


// Automatic CSRF protection for all state-changing requests
api.interceptors.request.use(
  async (config) => {
    // Always get CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      try {
        await getCsrfCookie()
      } catch (error) {
        console.warn('Failed to get CSRF cookie:', error)
        // Continue with request anyway - Laravel might still accept it
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle password confirmation required (423 Locked)
    if (error.response?.status === 423) {
      // Prevent infinite loops - don't show password confirmation for password confirmation endpoints
      const isPasswordConfirmationEndpoint = error.config?.url?.includes('/auth/confirm-password') || 
                                           error.config?.url?.includes('/auth/confirmed-password-status')
      
      if (!isPasswordConfirmationEndpoint) {
        try {
          // Show password confirmation dialog and wait for confirmation
          await showPasswordConfirmation()
          
          // Password confirmed successfully - retry the original request
          const originalRequest = error.config
          return api.request(originalRequest)
        } catch (confirmationError) {
          // Password confirmation failed or was cancelled
          // Return the original 423 error to let the caller handle it
          return Promise.reject(error)
        }
      }
    }
    
    // Handle CSRF token mismatch errors
    if (error.response?.status === 419) {
      console.error('CSRF token mismatch - this should not happen with automatic CSRF handling')
      // The user will see a proper error message from the API response
    }
    
    return Promise.reject(error)
  }
)

// Export default axios instance
// CSRF protection is now handled automatically by request interceptor
export default api 