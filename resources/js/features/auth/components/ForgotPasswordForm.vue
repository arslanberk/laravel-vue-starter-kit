<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { CheckCircle } from 'lucide-vue-next'
import { authApi } from '../api'
import { toast } from 'vue-sonner'

const emit = defineEmits(['submit'])

const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref('')
const secondsLeft = ref(0)

// Persistent storage for resend cooldown
const lastResendTime = useLocalStorage('forgot-password-resend-timestamp', 0)

// Timer for countdown updates
let countdownTimer = null

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

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

// Get resend button text based on current state
const getResendButtonText = () => {
  if (isLoading.value) return 'Sending...'
  if (!canResend()) return `Resend in ${secondsLeft.value}s`
  return 'Resend reset link'
}

const clearError = () => {
  error.value = ''
}

const handleSubmit = async () => {
  if (!isValidEmail.value) return
  
  await sendResetLink()
}

const sendResetLink = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    // Call the backend API to send password reset email
    await authApi.forgotPassword(email.value)
    
    // Always show success message regardless of whether email exists
    // This prevents email enumeration attacks
    isSubmitted.value = true
    
    // Start 60-second cooldown
    lastResendTime.value = Date.now()
    startCountdown()
    
    emit('submit', { email: email.value })
    
    // Show success toast
    toast.success('Reset link sent!', {
      description: 'Please check your email for the password reset link.'
    })
    
  } catch (err) {
    // Handle different error types
    if (err.response?.status === 422) {
      // Validation errors (including rate limiting)
      const validationErrors = err.response.data.errors
      if (validationErrors?.email) {
        // Show specific validation error for email field (safe for rate limiting)
        error.value = validationErrors.email[0]
      } else if (err.response.data.message) {
        // Show the main validation message
        error.value = err.response.data.message
      } else {
        error.value = 'Please check your information and try again'
      }
    } else if (err.response?.status === 429) {
      // Rate limiting error
      error.value = err.response.data.message || 'Too many requests. Please wait before retrying.'
    } else {
      // Show generic error message for other errors to avoid revealing email existence
      error.value = 'Unable to process your request. Please try again later.'
    }
    
    console.error('Forgot password error:', err)
    
    // Show error toast with specific message
    toast.error('Failed to send reset link', {
      description: error.value
    })
  } finally {
    isLoading.value = false
  }
}

const handleResendLink = async () => {
  // Don't allow resend if still in cooldown
  if (!canResend()) return
  
  await sendResetLink()
}

// Start countdown when component loads (in case user refreshes page)
onMounted(() => {
  startCountdown()
})

// Clean up timer when component is destroyed
onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <!-- Success State -->
  <div v-if="isSubmitted" class="flex flex-col gap-6 text-center">
    <div class="flex justify-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle class="h-6 w-6 text-green-600" />
      </div>
    </div>
    
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">Check your email</h1>
      <p class="text-sm text-muted-foreground">
        If an account with <strong>{{ email }}</strong> exists, we've sent a password reset link to that email address.
      </p>
    </div>
    
    <div class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Didn't receive the email? Check your spam folder or resend it.
      </p>
      
      <!-- Resend button with countdown -->
      <Button 
        @click="handleResendLink" 
        :disabled="isLoading || !canResend()"
        variant="outline" 
        class="w-full"
      >
        {{ getResendButtonText() }}
      </Button>
      
      <Button variant="outline" @click="isSubmitted = false" class="w-full">
        Try different email
      </Button>
      
      <Button variant="ghost" size="sm" asChild>
        <RouterLink to="/login">
          Back to sign in
        </RouterLink>
      </Button>
    </div>
  </div>
  
  <!-- Form State -->
  <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">
        Forgot your password?
      </h1>
      <p class="text-balance text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your password
      </p>
    </div>
    
    <div class="grid gap-6">
      <!-- Email Field -->
      <div class="grid gap-2">
        <Label for="email">Email address</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="Enter your email address"
          required
          :disabled="isLoading"
          :class="{ 'border-destructive': email && !isValidEmail }"
          @input="clearError"
        />
        <p v-if="email && !isValidEmail" class="text-sm text-destructive">
          Please enter a valid email address
        </p>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="text-sm text-destructive text-center">
        {{ error }}
      </div>
      
      <!-- Submit Button -->
      <Button 
        type="submit" 
        class="w-full" 
        :disabled="isLoading || !isValidEmail"
      >
        {{ isLoading ? 'Sending...' : 'Send reset link' }}
      </Button>
    </div>
    
    <!-- Back to Login -->
    <div class="text-center text-sm">
      Remember your password?
      <Button variant="link" size="sm" class="h-auto p-0 font-normal underline underline-offset-4" asChild>
        <RouterLink to="/login">
          Sign in
        </RouterLink>
      </Button>
    </div>
  </form>
</template> 