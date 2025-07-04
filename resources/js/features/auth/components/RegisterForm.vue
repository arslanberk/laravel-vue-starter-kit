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
import { validateName, validateEmail, validatePassword, validatePasswordConfirmation, validateRegisterForm } from '../utils/validation'

const emit = defineEmits(['success'])

// Auth composable
const { register, isLoading, error, clearError } = useAuth()

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Security: Clear password fields on component mount
onMounted(() => {
  password.value = ''
  confirmPassword.value = ''
  showPassword.value = false
  showConfirmPassword.value = false
})

// Individual field validation states
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const passwordConfirmationError = ref('')

// Track which fields have been touched
const nameTouched = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)
const passwordConfirmationTouched = ref(false)

// Individual field validation functions with debouncing
const debouncedValidateName = useDebounceFn(() => {
  if (nameTouched.value && name.value) {
    const result = validateName(name.value)
    nameError.value = result === true ? '' : result
  }
}, 500)

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
    
    // Also revalidate password confirmation if it has been touched
    if (passwordConfirmationTouched.value && confirmPassword.value) {
      debouncedValidatePasswordConfirmation()
    }
  }
}, 500)

const debouncedValidatePasswordConfirmation = useDebounceFn(() => {
  if (passwordConfirmationTouched.value && confirmPassword.value) {
    const result = validatePasswordConfirmation(confirmPassword.value, password.value)
    passwordConfirmationError.value = result === true ? '' : result
  }
}, 500)

// Check if form is valid for enabling submit button
const isFormValid = computed(() => {
  // All fields must have values
  const hasAllFields = name.value.trim() && email.value.trim() && password.value && confirmPassword.value
  
  // Terms must be accepted
  const termsAccepted = acceptTerms.value
  
  // Check for any current validation errors (but only if fields have been touched)
  const hasValidationErrors = (
    (nameTouched.value && nameError.value) ||
    (emailTouched.value && emailError.value) ||
    (passwordTouched.value && passwordError.value) ||
    (passwordConfirmationTouched.value && passwordConfirmationError.value)
  )
  
  // Form is valid if all fields have values, terms accepted, and no validation errors
  return hasAllFields && termsAccepted && !hasValidationErrors
})

// Field event handlers
const handleNameInput = () => {
  nameTouched.value = true
  // Clear server errors when user starts typing
  if (error.value) clearError()
  debouncedValidateName()
}

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

const handlePasswordConfirmationInput = () => {
  passwordConfirmationTouched.value = true
  // Clear server errors when user starts typing
  if (error.value) clearError()
  debouncedValidatePasswordConfirmation()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  // Final validation check before submission
  const validation = validateRegisterForm(name.value, email.value, password.value, confirmPassword.value)
  
  if (!validation.isValid) {
    // Show all validation errors
    nameError.value = validation.errors.name || ''
    emailError.value = validation.errors.email || ''
    passwordError.value = validation.errors.password || ''
    passwordConfirmationError.value = validation.errors.password_confirmation || ''
    return
  }
  
  if (!acceptTerms.value) {
    return
  }
  
  try {
    const userData = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    })
    
    // Security: Clear password fields after successful registration (before any redirects)
    password.value = ''
    confirmPassword.value = ''
    showPassword.value = false
    showConfirmPassword.value = false
    
    emit('success', userData)
  } catch (err) {
    // Error is handled by the auth store and displayed via error reactive ref
    console.error('Registration failed:', err)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">
        Create your account
      </h1>
      <p class="text-balance text-sm text-muted-foreground">
        Start your journey with our Laravel application today
      </p>
    </div>
    
    <!-- Server Error Alert -->
    <Alert v-if="error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Registration Failed</AlertTitle>
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>
    
    <div class="grid gap-6">
      <!-- Name Field -->
      <div class="grid gap-2">
        <Label for="name">Full Name</Label>
        <Input
          id="name"
          v-model="name"
          type="text"
          placeholder="Enter your full name"
          required
          :disabled="isLoading"
          :class="{ 'border-destructive': nameError }"
          @input="handleNameInput"
        />
        <p v-if="nameError" class="text-sm text-destructive">
          {{ nameError }}
        </p>
      </div>
      
      <!-- Email Field -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="your@email.com"
          required
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
        <Label for="password">Password</Label>
        <div class="relative">
          <Input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Create a strong password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="pr-10"
            :class="{ 'border-destructive': passwordError }"
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
      
      <!-- Confirm Password Field with Show/Hide Toggle -->
      <div class="grid gap-2">
        <Label for="confirm-password">Confirm Password</Label>
        <div class="relative">
          <Input
            id="confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
            autocomplete="new-password"
            required
            :disabled="isLoading"
            class="pr-10"
            :class="{ 'border-destructive': passwordConfirmationError }"
            @input="handlePasswordConfirmationInput"
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
        <p v-if="passwordConfirmationError" class="text-sm text-destructive">
          {{ passwordConfirmationError }}
        </p>
      </div>
      
      <!-- Terms and Conditions -->
      <div class="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          v-model="acceptTerms"
          :disabled="isLoading"
        />
        <Label
          for="terms"
          class="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the
          <Button variant="link" size="sm" class="h-auto p-0 font-normal underline underline-offset-4" asChild>
            <RouterLink to="/terms-of-service">Terms of Service</RouterLink>
          </Button>
          and
          <Button variant="link" size="sm" class="h-auto p-0 font-normal underline underline-offset-4" asChild>
            <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
          </Button>
        </Label>
      </div>
      
      <!-- Submit Button -->
      <Button 
        type="submit" 
        class="w-full" 
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Creating account...' : 'Create account' }}
      </Button>
    </div>
    
    <!-- Sign In Link -->
    <div class="text-center text-sm">
      Already have an account?
      <Button variant="link" size="sm" class="h-auto p-0 font-normal underline underline-offset-4" asChild>
        <RouterLink to="/login">
          Sign in
        </RouterLink>
      </Button>
    </div>
  </form>
</template> 