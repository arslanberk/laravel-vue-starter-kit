<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Eye, EyeOff, CheckCircle } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { authApi } from '../api'

const emit = defineEmits(['submit'])
const route = useRoute()

const token = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const error = ref('')

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value || confirmPassword.value === ''
})

const isValidPassword = computed(() => {
  return password.value.length >= 8
})

const isFormValid = computed(() => {
  return token.value && email.value && password.value && confirmPassword.value && passwordsMatch.value && isValidPassword.value
})

const clearError = () => {
  error.value = ''
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Call the backend API to reset password
    await authApi.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    })
    
    // Security: Clear password fields after successful reset
    password.value = ''
    confirmPassword.value = ''
    showPassword.value = false
    showConfirmPassword.value = false
    
    isSuccess.value = true
    emit('submit', { 
      token: token.value,
      email: email.value 
    })
    
  } catch (err) {
    // Handle different error types
    if (err.response?.status === 422) {
      // Validation errors
      const validationErrors = err.response.data.errors
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat()
        error.value = errorMessages.join(', ')
      } else {
        error.value = 'Please check your information and try again'
      }
    } else if (err.response?.status === 400) {
      // Invalid or expired token
      error.value = 'This password reset link is invalid or has expired. Please request a new one.'
    } else {
      // Generic error
      error.value = 'Unable to reset password. Please try again later.'
    }
    
    console.error('Password reset error:', err)
  } finally {
    isLoading.value = false
  }
}

// Extract token and email from URL query parameters on component mount
onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
  
  // Security: Clear password fields on component mount
  password.value = ''
  confirmPassword.value = ''
  showPassword.value = false
  showConfirmPassword.value = false
  
  // If no token is provided, this might be an invalid access
  if (!token.value) {
    error.value = 'Invalid password reset link. Please check your email for the correct link.'
  }
})
</script>

<template>
  <!-- Success State -->
  <div v-if="isSuccess" class="flex flex-col gap-6 text-center">
    <div class="flex justify-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckCircle class="h-6 w-6 text-green-600" />
      </div>
    </div>
    
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">Password reset successful</h1>
      <p class="text-sm text-muted-foreground">
        Your password has been successfully updated. You can now sign in with your new password.
      </p>
    </div>
    
    <Button asChild class="w-full">
      <RouterLink to="/login">
        Continue to sign in
      </RouterLink>
    </Button>
  </div>
  
  <!-- Form State -->
  <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">
        Reset your password
      </h1>
      <p class="text-balance text-sm text-muted-foreground">
        Enter a new secure password for your account
      </p>
    </div>
    
    <div class="grid gap-6">
      <!-- Email Field (readonly, for reference) -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="your@email.com"
          readonly
          class="bg-muted"
        />
      </div>
      
      <!-- New Password Field with Show/Hide Toggle -->
      <div class="grid gap-2">
        <Label for="password">New Password</Label>
        <div class="relative">
          <Input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your new password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="pr-10"
            :class="{ 'border-destructive': password && !isValidPassword }"
            @input="clearError"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            @click="togglePasswordVisibility"
            :disabled="isLoading"
          >
            <Eye v-if="!showPassword" class="h-4 w-4 text-muted-foreground" />
            <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
            <span class="sr-only">
              {{ showPassword ? 'Hide password' : 'Show password' }}
            </span>
          </Button>
        </div>
        <p v-if="password && !isValidPassword" class="text-sm text-destructive">
          Password must be at least 8 characters long
        </p>
      </div>
      
      <!-- Confirm Password Field with Show/Hide Toggle -->
      <div class="grid gap-2">
        <Label for="confirm-password">Confirm New Password</Label>
        <div class="relative">
          <Input
            id="confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your new password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="pr-10"
            :class="{ 'border-destructive': !passwordsMatch && confirmPassword }"
            @input="clearError"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            @click="toggleConfirmPasswordVisibility"
            :disabled="isLoading"
          >
            <Eye v-if="!showConfirmPassword" class="h-4 w-4 text-muted-foreground" />
            <EyeOff v-else class="h-4 w-4 text-muted-foreground" />
            <span class="sr-only">
              {{ showConfirmPassword ? 'Hide password' : 'Show password' }}
            </span>
          </Button>
        </div>
        <p v-if="!passwordsMatch && confirmPassword" class="text-sm text-destructive">
          Passwords do not match
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
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Updating password...' : 'Update password' }}
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