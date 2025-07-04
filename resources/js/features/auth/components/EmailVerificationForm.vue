<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { Button } from '@/shared/components/ui/button'
import { CheckCircle, Mail, Clock } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { authApi } from '../api'
import { toast } from 'vue-sonner'

const emit = defineEmits(['resend'])
const { user } = useAuth()

// Simple state
const isLoading = ref(false)
const secondsLeft = ref(0)

// Persistent storage for resend cooldown
const lastResendTime = useLocalStorage('email-verification-resend-timestamp', 0)

// Timer for countdown updates
let countdownTimer = null

// Check if user can resend (no cooldown active)
const canResend = () => secondsLeft.value === 0

// Calculate how many seconds are left in cooldown
const updateSecondsLeft = () => {
  if (!lastResendTime.value) {
    secondsLeft.value = 0
    return
  }

  const now = Date.now()
  const timePassed = Math.floor((now - lastResendTime.value) / 1000)
  const timeLeft = Math.max(0, 60 - timePassed)
  
  secondsLeft.value = timeLeft

  // Clean up localStorage when cooldown expires
  if (timeLeft === 0) {
    lastResendTime.value = 0
  }
}

// Start the countdown timer
const startCountdown = () => {
  updateSecondsLeft()
  
  // Only run timer if there are seconds left
  if (secondsLeft.value > 0) {
    countdownTimer = setInterval(() => {
      updateSecondsLeft()
      
      // Stop timer when countdown finishes
      if (secondsLeft.value === 0) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  }
}

// Stop the countdown timer
const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// Get button text based on current state
const getButtonText = () => {
  if (isLoading.value) return 'Sending...'
  if (!canResend()) return `Resend in ${secondsLeft.value}s`
  return 'Resend verification email'
}

// Handle resend email button click
const handleResendEmail = async () => {
  // Don't allow resend if still in cooldown
  if (!canResend()) return
  
  try {
    isLoading.value = true
    
    // Send the email
    await authApi.resendEmailVerification()
    
    // Start 60-second cooldown
    lastResendTime.value = Date.now()
    startCountdown()
    
    // Notify parent component
    emit('resend', { email: user.value?.email })
    
    // Show success message
    toast.success('Verification email sent!', {
      description: 'Please check your email for the verification link.'
    })
    
  } catch (error) {
    console.error('Failed to resend verification email:', error)
    
    // Show error message
    toast.error('Failed to send email', {
      description: error.response?.data?.message || 'Please try again in a few minutes.'
    })
  } finally {
    isLoading.value = false
  }
}

// Start countdown when component loads
onMounted(() => {
  startCountdown()
})

// Clean up timer when component is destroyed
onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <div class="flex flex-col gap-6 text-center">
    <!-- Email icon -->
    <div class="flex justify-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <Mail class="h-6 w-6 text-blue-600" />
      </div>
    </div>
    
    <!-- Page title and description -->
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">Verify your email</h1>
      <p class="text-sm text-muted-foreground">
        We've sent a verification link to <strong>{{ user?.email || 'your email address' }}</strong>
      </p>
    </div>
    
    <!-- Instructions -->
    <div class="space-y-4">
      <!-- Check email instruction -->
      <div class="rounded-lg border p-4 text-left">
        <div class="flex items-start space-x-3">
          <Clock class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="space-y-1">
            <p class="text-sm font-medium">Check your email</p>
            <p class="text-sm text-muted-foreground">
              Click the verification link in the email to activate your account. 
              The link will expire in 60 minutes.
            </p>
          </div>
        </div>
      </div>
      
      <!-- After verification instruction -->
      <div class="rounded-lg border p-4 text-left">
        <div class="flex items-start space-x-3">
          <CheckCircle class="h-5 w-5 text-muted-foreground mt-0.5" />
          <div class="space-y-1">
            <p class="text-sm font-medium">After verification</p>
            <p class="text-sm text-muted-foreground">
              You'll be automatically signed in and can access all features of your account.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Didn't receive the email? Check your spam folder or resend it.
      </p>
            
      <!-- Resend button -->
      <Button 
        @click="handleResendEmail" 
        :disabled="isLoading || !canResend()"
        variant="outline" 
        class="w-full"
      >
        {{ getButtonText() }}
      </Button>
      
      <!-- Back to login link -->
      <Button variant="ghost" size="sm" asChild>
        <RouterLink to="/login">
          Back to sign in
        </RouterLink>
      </Button>
    </div>
  </div>
</template> 