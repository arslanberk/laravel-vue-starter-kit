import { ref } from 'vue'
import { authApi } from '../api'

// Global state for password confirmation dialog - singleton pattern
const isDialogOpen = ref(false)
const isLoading = ref(false)
const error = ref('')

// Store the resolve/reject functions for the current confirmation
let resolveConfirmation = null
let rejectConfirmation = null

// Callback to clear password input (set by component)
let clearPasswordCallback = null

// Function to register password clearing callback
const registerPasswordClearCallback = (callback) => {
  clearPasswordCallback = callback
}

// Function to clear password input
const clearPassword = () => {
  if (clearPasswordCallback) {
    clearPasswordCallback()
  }
}

// Show password confirmation dialog and return a promise
const showPasswordConfirmation = () => {
  return new Promise((resolve, reject) => {
    // Store the promise handlers
    resolveConfirmation = resolve
    rejectConfirmation = reject
    
    // Clear previous error and show dialog
    error.value = ''
    isDialogOpen.value = true
  })
}

// Handle password confirmation
const confirmPassword = async (password) => {
  if (!password?.trim()) {
    error.value = 'Password is required'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Call the password confirmation API
    const result = await authApi.passwordConfirmation.confirm(password)
    
    // Close dialog and resolve the promise
    isDialogOpen.value = false
    isLoading.value = false
    
    // Clear password input
    clearPassword()
    
    if (resolveConfirmation) {
      resolveConfirmation(result)
      resolveConfirmation = null
      rejectConfirmation = null
    }
  } catch (err) {
    isLoading.value = false
    
    // Handle different error types
    if (err.response?.status === 422) {
      // Validation error (wrong password)
      error.value = err.response.data?.message || 'Invalid password. Please try again.'
    } else if (err.response?.status === 429) {
      // Too many attempts
      error.value = 'Too many attempts. Please wait before trying again.'
    } else {
      // Generic error
      error.value = 'Failed to confirm password. Please try again.'
    }
  }
}

// Handle dialog cancellation
const cancelConfirmation = () => {
  isDialogOpen.value = false
  isLoading.value = false
  error.value = ''
  
  // Clear password input
  clearPassword()
  
  if (rejectConfirmation) {
    rejectConfirmation(new Error('Password confirmation was cancelled'))
    resolveConfirmation = null
    rejectConfirmation = null
  }
}

// Check if password is already confirmed (optional utility)
const checkConfirmationStatus = async () => {
  try {
    const status = await authApi.passwordConfirmation.getStatus()
    return status.confirmed || false
  } catch (err) {
    console.error('Failed to check password confirmation status:', err)
    return false
  }
}

// Export the composable function
export function usePasswordConfirmation() {
  return {
    // State (shared globally)
    isDialogOpen,
    isLoading,
    error,
    
    // Actions
    showPasswordConfirmation,
    confirmPassword,
    cancelConfirmation,
    
    // Utilities
    checkConfirmationStatus,
    registerPasswordClearCallback
  }
}

// Export the show function directly for use in api.js
export { showPasswordConfirmation } 