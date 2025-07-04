import { storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const { 
    user, 
    isLoading, 
    error, 
    isAuthChecked,
    isAuthenticated, 
    isEmailVerified, 
    isTwoFactorEnabled 
  } = storeToRefs(authStore)

  // VueUse for persistent auth preferences
  const rememberMe = useLocalStorage('auth-remember-me', false)

  /**
   * Enhanced logout with navigation and cleanup
   * @param {string} redirectTo - Where to redirect after logout ('login', 'home', or custom path)
   * @param {boolean} showToast - Whether to show logout success message
   */
  const logout = async (redirectTo = 'login', showToast = true) => {
    try {
      // Call store logout (handles API call and user data cleanup)
      await authStore.logout()
      
      // Clear auth-related localStorage
      rememberMe.value = false
      
      // Show success message
      if (showToast) {
        toast.success('Logged out successfully', {
          description: 'You have been securely logged out.'
        })
      }
      
      // Navigate based on redirectTo parameter
      switch (redirectTo) {
        case 'home':
        case '/':
          router.replace('/')
          break
        case 'login':
        default:
          router.replace('/login')
          break
      }
      
    } catch (err) {
      // Show error toast even if logout partially failed
      toast.error('Logout Error', {
        description: 'You have been logged out, but there was an issue. Please refresh if needed.'
      })
      
      // Still redirect even if there was an error
      await router.push('/login')
    }
  }

  return {
    // State (reactive refs)
    user,
    isLoading,
    error,
    isAuthChecked,
    isAuthenticated,
    isEmailVerified,
    isTwoFactorEnabled,
    rememberMe,
    
    // Actions (methods)
    login: authStore.login,
    logout, // Enhanced logout with navigation
    register: authStore.register,
    checkAuth: authStore.checkAuth,
    initializeAuth: authStore.initializeAuth,
    clearError: authStore.clearError
  }
} 