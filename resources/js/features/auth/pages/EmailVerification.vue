<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import EmailVerificationForm from '../components/EmailVerificationForm.vue'
import AuthTips from '../components/AuthTips.vue'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-vue-next'
import { authApi } from '../api'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { checkAuth, user } = useAuth()

// Check if this is a verification link (has id and hash params)
const isVerificationLink = route.params.id && route.params.hash

// Verification link states
const isVerifying = ref(false)
const verificationSuccess = ref(false)
const verificationError = ref(false)
const errorMessage = ref('The verification link is invalid or has expired.')

// Countdown for automatic redirect
const redirectSeconds = ref(5)
let redirectTimer = null

// SEO meta data - dynamic based on state
const pageTitle = isVerificationLink ? 'Verifying Email - Laravel App' : 'Verify Email - Laravel App'
useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: 'Verify your email address to complete your Laravel App account setup and access all features.' },
    { name: 'keywords', content: 'email verification, verify email, account activation, confirm email' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: 'Complete your account setup by verifying your email address.' },
    { property: 'og:type', content: 'website' }
  ]
})

// Start countdown timer for automatic redirect
const startRedirectCountdown = () => {
  redirectTimer = setInterval(() => {
    redirectSeconds.value--
    
    // Redirect when countdown reaches 0
    if (redirectSeconds.value <= 0) {
      clearInterval(redirectTimer)
      redirectTimer = null
      redirectToDashboard()
    }
  }, 1000)
}

// Stop countdown timer
const stopRedirectCountdown = () => {
  if (redirectTimer) {
    clearInterval(redirectTimer)
    redirectTimer = null
  }
}

// Verify email from link
const verifyEmailFromLink = async () => {
  isVerifying.value = true
  
  try {
    const { id, hash } = route.params
    
    // Make API call to verify email
    const response = await authApi.verifyEmail(id, hash, route.query)
    
    // Handle successful verification
    isVerifying.value = false
    verificationSuccess.value = true
    
    // Refresh user's auth state to get updated email verification status
    await checkAuth()
    
    // Start automatic redirect countdown
    startRedirectCountdown()
    
    // Email verification successful, handled by component
    
  } catch (error) {
    console.error('Email verification failed:', error)
    
    isVerifying.value = false
    verificationError.value = true
    
    // Handle different error types
    if (error.response?.status === 403) {
      errorMessage.value = 'The verification link is invalid or has expired.'
    } else if (error.response?.status === 409) {
      errorMessage.value = 'This email address has already been verified.'
    } else {
      errorMessage.value = 'An error occurred during verification. Please try again.'
    }
  }
}

// Redirect to dashboard
const redirectToDashboard = () => {
  stopRedirectCountdown()
  router.push('/dashboard')
}

// Go back to verification form (from error state)
const showVerificationForm = () => {
  // Reset all states
  isVerifying.value = false
  verificationSuccess.value = false
  verificationError.value = false
  
  // Navigate to verification form (without params)
  router.push('/email/verify')
}

// Handle resend success from form
const handleResendSuccess = (data) => {
      // Verification email resent successfully
}

// Component initialization
onMounted(() => {
  // If this is a verification link, start verification automatically
  if (isVerificationLink) {
    verifyEmailFromLink()
  }
})

// Cleanup
onUnmounted(() => {
  stopRedirectCountdown()
})
</script>

<template>
  <!-- Consistent two-column layout for all auth pages -->
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="email-verification" />
    </div>
    
    <!-- Content Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          
          <!-- Email Verification Link States -->
          <div v-if="isVerificationLink" class="flex flex-col gap-6 text-center">
            <!-- Loading State -->
            <div v-if="isVerifying">
              <!-- Icon -->
              <div class="flex justify-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Loader2 class="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              </div>
              
              <!-- Title and description -->
              <div class="space-y-2">
                <h1 class="text-2xl font-bold">Verifying your email</h1>
                <p class="text-sm text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </div>
              
              <!-- Progress card -->
              <div class="rounded-lg border p-4 text-left">
                <div class="flex items-start space-x-3">
                  <Clock class="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div class="space-y-1">
                    <p class="text-sm font-medium">Processing verification</p>
                    <p class="text-sm text-muted-foreground">
                      We're confirming your email address. This should only take a moment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Success State -->
            <div v-else-if="verificationSuccess">
              <!-- Icon -->
              <div class="flex justify-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle class="h-6 w-6 text-green-600" />
                </div>
              </div>
              
              <!-- Title and description -->
              <div class="space-y-2">
                <h1 class="text-2xl font-bold">Email verified successfully!</h1>
                <p class="text-sm text-muted-foreground">
                  Your email <strong>{{ user?.email || 'address' }}</strong> has been verified. You can now access all features.
                </p>
              </div>
              
              <!-- Success instruction card -->
              <div class="rounded-lg border p-4 text-left">
                <div class="flex items-start space-x-3">
                  <CheckCircle class="h-5 w-5 text-green-600 mt-0.5" />
                  <div class="space-y-1">
                    <p class="text-sm font-medium">Account activated</p>
                    <p class="text-sm text-muted-foreground">
                      Your account is now fully activated and you have access to all features of your Laravel App dashboard.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="space-y-4">
                <!-- Countdown alert -->
                <Alert>
                  <Clock class="h-4 w-4" />
                  <AlertDescription>
                    Redirecting to dashboard in {{ redirectSeconds }} seconds.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="verificationError">
              <!-- Icon -->
              <div class="flex justify-center">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <XCircle class="h-6 w-6 text-red-600" />
                </div>
              </div>
              
              <!-- Title and description -->
              <div class="space-y-2">
                <h1 class="text-2xl font-bold">Verification failed</h1>
                <p class="text-sm text-muted-foreground">
                  {{ errorMessage }}
                </p>
              </div>
              
              <!-- Error instruction card -->
              <div class="rounded-lg border p-4 text-left">
                <div class="flex items-start space-x-3">
                  <XCircle class="h-5 w-5 text-red-600 mt-0.5" />
                  <div class="space-y-1">
                    <p class="text-sm font-medium">Link expired or invalid</p>
                    <p class="text-sm text-muted-foreground">
                      Verification links expire after 60 minutes for security. You can request a new verification email below.
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Actions -->
              <div class="space-y-4">
                <p class="text-sm text-muted-foreground">
                  Don't worry, you can request a new verification email and try again.
                </p>
                
                <!-- Primary action -->
                <Button @click="showVerificationForm" variant="outline" class="w-full">
                  Request new verification email
                </Button>
              </div>
            </div>
          </div>

          <!-- Regular Verification Form (when not verification link) -->
          <EmailVerificationForm v-else @resend="handleResendSuccess" />
          
        </div>
      </div>
    </div>
  </div>
</template> 