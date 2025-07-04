import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Import layouts
import GuestLayout from '@/shared/components/layout/GuestLayout.vue'

// Import feature routers
import landingRoutes from '@/features/landing/router'
import authRoutes from '@/features/auth/router'
import dashboardRoutes from '@/features/dashboard/router'
import settingsRoutes from '@/features/settings/router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'

// Combine all routes
const routes = [
  // Guest routes (wrapped in GuestLayout)
  {
    path: '/',
    component: GuestLayout,
    children: [
      // Landing feature routes
      ...landingRoutes,
      // Auth feature routes
      ...authRoutes,
    ]
  },
  // Dashboard routes (wrapped in DashboardLayout with /dashboard prefix)
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      // Dashboard feature routes
      ...dashboardRoutes,
      // Settings feature routes  
      ...settingsRoutes,
    ]
  },
  
  // Catch-all route for 404 (will be implemented later)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

// Create router instance
export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Clean router guard with grouped logic
router.beforeEach(async (to, from, next) => {
  // Import auth store dynamically to avoid circular dependencies
  const { useAuthStore } = await import('@/features/auth/stores/authStore')
  const authStore = useAuthStore()

  if (!authStore.isAuthChecked) {
    // Wait until App.vue finishes initialization
    await new Promise((resolve) => {
      if (authStore.isAuthChecked) return resolve()
      const stop = watch(
        () => authStore.isAuthChecked,
        (value) => {
          if (value) {
            stop()
            resolve()
          }
        }
      )
    })
  }

  const isAuthenticated = authStore.isAuthenticated
  const isEmailVerified = authStore.isEmailVerified
  const requiresTwoFactor = authStore.requiresTwoFactor
  
  // Use only route meta properties
  const { requiresAuth, requiresGuest, isEmailVerification, isTwoFactorAuthentication } = to.meta

  // Handle routes that require authentication
  if (requiresAuth) {
    if (!isAuthenticated) {
      next({ name: 'Login' })
      return
    }
    
    // User is authenticated, check email verification for auth routes only
    if (!isEmailVerified && !isEmailVerification) {
      next({ name: 'EmailVerification' })
      return
    }
    
    // User is verified but trying to access email verification page
    if (isEmailVerified && isEmailVerification) {
      next({ name: 'Dashboard' })
      return
    }
  }

  // Handle routes that require guest (non-authenticated users)
  if (requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // Handle 2FA authentication flow
  if (requiresTwoFactor) {
    // User is in 2FA flow and should be redirected to 2FA page
    if (!isTwoFactorAuthentication) {
      next({ name: 'TwoFactorAuthentication' })
      return
    }
  } else if (isTwoFactorAuthentication) {
    // User is trying to access 2FA page but doesn't need 2FA
    // Redirect to login (they should not be on this page)
    next({ name: 'Login' })
    return
  }

  // All other cases - allow navigation (public pages, etc.)
  next()
}) 