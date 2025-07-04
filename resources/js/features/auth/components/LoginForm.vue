<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { RouterLink } from 'vue-router'
import { Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Alert, AlertTitle, AlertDescription } from '@/shared/components/ui/alert'
import { useAuth } from '../composables/useAuth'
import { validateEmail, validatePassword, validateLoginForm } from '../utils/validation'

const emit = defineEmits(['success', 'two-factor-required'])

// Auth composable
const { login, isLoading, error, clearError, rememberMe } = useAuth()

// Form state
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Security: Clear password field on component mount
onMounted(() => {
  password.value = ''
  showPassword.value = false
})

// Individual field validation states
const emailError = ref('')
const passwordError = ref('')

// Track which fields have been touched
const emailTouched = ref(false)
const passwordTouched = ref(false)

// Individual field validation functions with debouncing
const debouncedValidateEmail = useDebounceFn(() => {
  if (emailTouched.value && email.value) {
    const result = validateEmail(email.value)
    emailError.value = result === true ? '' : result
  }
}, 500)

const debouncedValidatePassword = useDebounceFn(() => {
  if (passwordTouched.value && password.value) {
    const result = validatePassword(password.value)
    passwordError.value = result === true ? '' : result
  }
}, 500)

// Check if form is valid for enabling submit button
const isFormValid = computed(() => {
  // Both fields must have values
  if (!email.value.trim() || !password.value) {
    return false
  }
  
  // No validation errors should exist (only check if fields have been validated)
  if (emailTouched.value && emailError.value) return false
  if (passwordTouched.value && passwordError.value) return false
  
  return true
})

// Field event handlers
const handleEmailInput = () => {
  emailTouched.value = true
  // Clear server errors when user starts typing
  if (error.value) clearError()
  debouncedValidateEmail()
}

const handlePasswordInput = () => {
  passwordTouched.value = true
  // Clear server errors when user starts typing
  if (error.value) clearError()
  debouncedValidatePassword()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  // Final validation check before submission
  const validation = validateLoginForm(email.value, password.value)
  
  if (!validation.isValid) {
    // Show all validation errors
    emailError.value = validation.errors.email || ''
    passwordError.value = validation.errors.password || ''
    return
  }

  try {
    const result = await login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value // Laravel Fortify will extend session lifetime when true
    })

    // Security: Clear password field after successful login (before any redirects)
    password.value = ''
    showPassword.value = false

    // Check if 2FA is required
    if (result.requiresTwoFactor) {
      // Emit two-factor-required event instead of success
      emit('two-factor-required')
      return
    }

    // Normal login - emit success event with user data
    emit('success', result)
  } catch (err) {
    // Error is already handled in the auth store
    console.error('Login failed:', err)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">
        Sign in to your account
      </h1>
      <p class="text-balance text-sm text-muted-foreground">
        Enter your credentials to access your account dashboard
      </p>
    </div>
    
    <!-- Server Error Alert -->
    <Alert v-if="error" variant="destructive">
      <AlertCircle class="w-4 h-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {{ error }}
      </AlertDescription>
    </Alert>
    
    <div class="grid gap-6">
      <!-- Email Field -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="your@email.com"
          autocomplete="email"
          :disabled="isLoading"
          :class="{ 'border-destructive': emailError }"
          @input="handleEmailInput"
        />
        <p v-if="emailError" class="text-sm text-destructive">
          {{ emailError }}
        </p>
      </div>
      
      <!-- Password Field with Show/Hide Toggle -->
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <Button
            variant="link"
            size="sm"
            class="ml-auto h-auto p-0 text-sm underline-offset-4 hover:underline"
            type="button"
            :disabled="isLoading"
            asChild
          >
            <RouterLink to="/forgot-password">
              Forgot your password?
            </RouterLink>
          </Button>
        </div>
        <div class="relative">
          <Input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter your password"
            autocomplete="new-password"
            :disabled="isLoading"
            :class="{ 'border-destructive': passwordError }"
            class="pr-10"
            @input="handlePasswordInput"
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
        <p v-if="passwordError" class="text-sm text-destructive">
          {{ passwordError }}
        </p>
      </div>

      <!-- Remember Me Checkbox -->
      <div class="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          v-model="rememberMe"
          :disabled="isLoading"
        />
        <Label
          for="remember-me"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </Label>
      </div>
      
      <!-- Submit Button -->
      <Button 
        type="submit" 
        class="w-full" 
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Signing in...' : 'Sign in' }}
      </Button>
    </div>
    
    <!-- Sign Up Link -->
    <div class="text-center text-sm">
      Don't have an account?
      <Button 
        variant="link" 
        size="sm" 
        class="h-auto p-0 font-normal underline underline-offset-4" 
        :disabled="isLoading"
        asChild
      >
        <RouterLink to="/register">
          Sign up
        </RouterLink>
      </Button>
    </div>
  </form>
</template> 