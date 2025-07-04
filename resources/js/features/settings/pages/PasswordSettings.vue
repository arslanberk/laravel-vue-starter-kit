<script setup>
import { ref } from 'vue'
import { useHead } from '@vueuse/head'
import { authApi } from '@/features/auth/api'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Progress } from '@/shared/components/ui/progress'
import { toast } from 'vue-sonner'
import { CheckCircle2, Lock, Key, Shield } from 'lucide-vue-next'
import SettingsLayout from '../components/SettingsLayout.vue'

// Form state
const isLoading = ref(false)
const error = ref('')
const justChanged = ref(false)
const formData = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// Password strength calculation
const calculatePasswordStrength = (password) => {
  const checks = {
    length: password ? password.length >= 8 : false,
    lowercase: password ? /[a-z]/.test(password) : false,
    uppercase: password ? /[A-Z]/.test(password) : false,
    numbers: password ? /\d/.test(password) : false,
    special: password ? /[^A-Za-z0-9]/.test(password) : false
  }
  
  if (!password) {
    return { 
      score: 0, 
      label: 'No password',
      checks
    }
  }
  
  const score = Object.values(checks).filter(Boolean).length
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return {
    score: (score / 5) * 100,
    label: labels[score - 1] || 'Very Weak',
    checks
  }
}

// Reactive password strength
const passwordStrength = ref(calculatePasswordStrength(''))

// Update password strength and validation when password changes
const updatePasswordStrength = () => {
  passwordStrength.value = calculatePasswordStrength(formData.value.password)
  validatePasswords()
}

// Update validation when any field changes
const updateValidation = () => {
  validatePasswords()
}

// Real-time validation state
const validationErrors = ref({
  passwordMismatch: false,
  passwordTooShort: false,
  samePassword: false
})

// Real-time validation checks
const validatePasswords = () => {
  const { current_password, password, password_confirmation } = formData.value
  
  // Check if passwords match (only if both are entered)
  validationErrors.value.passwordMismatch = 
    password_confirmation && password && password !== password_confirmation
  
  // Check if password is too short (only if entered)
  validationErrors.value.passwordTooShort = 
    password && password.length < 8
  
  // Check if new password is same as current (only if both entered)
  validationErrors.value.samePassword = 
    current_password && password && current_password === password
}

// Form validation for submission
const validateForm = () => {
  if (!formData.value.current_password.trim()) {
    error.value = 'Current password is required'
    return false
  }
  
  if (!formData.value.password.trim()) {
    error.value = 'New password is required'
    return false
  }
  
  if (formData.value.password.length < 8) {
    error.value = 'New password must be at least 8 characters long'
    return false
  }
  
  if (formData.value.password !== formData.value.password_confirmation) {
    error.value = 'Password confirmation does not match'
    return false
  }
  
  if (formData.value.current_password === formData.value.password) {
    error.value = 'New password must be different from current password'
    return false
  }
  
  return true
}

// Check if form is valid for submission
const isFormValid = () => {
  const { current_password, password, password_confirmation } = formData.value
  
  return current_password.trim() && 
         password.trim() && 
         password_confirmation.trim() &&
         password.length >= 8 &&
         password === password_confirmation &&
         current_password !== password &&
         !validationErrors.value.passwordMismatch &&
         !validationErrors.value.passwordTooShort &&
         !validationErrors.value.samePassword
}

// Change password - this will trigger password confirmation automatically
const changePassword = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    await authApi.profile.changePassword({
      current_password: formData.value.current_password,
      password: formData.value.password,
      password_confirmation: formData.value.password_confirmation
    })
    
    // Clear form on success
    formData.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    }
    passwordStrength.value = calculatePasswordStrength('')
    validationErrors.value = {
      passwordMismatch: false,
      passwordTooShort: false,
      samePassword: false
    }
    justChanged.value = true
    
    // Clear success state after 3 seconds
    setTimeout(() => {
      justChanged.value = false
    }, 3000)
    
    toast.success('Password changed successfully!')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to change password'
    toast.error('Failed to change password')
  } finally {
    isLoading.value = false
  }
}

// Clear form
const clearForm = () => {
  formData.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
  passwordStrength.value = calculatePasswordStrength('')
  error.value = ''
  validationErrors.value = {
    passwordMismatch: false,
    passwordTooShort: false,
    samePassword: false
  }
}

// Check if form has data
const hasFormData = () => {
  return formData.value.current_password.trim() || 
         formData.value.password.trim() || 
         formData.value.password_confirmation.trim()
}

// SEO meta data for password settings page
useHead({
  title: 'Password Settings - Laravel App',
  meta: [
    { name: 'description', content: 'Update your password and security settings.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Password Settings - Laravel App' },
    { property: 'og:description', content: 'Manage your account password and security.' },
  ]
})
</script>

<template>
  <SettingsLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Password</h2>
        <p class="text-muted-foreground">
          Update your password and manage security settings.
        </p>
      </div>

      <!-- Error Alert -->
      <Alert v-if="error" variant="destructive">
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Success Alert -->
      <Alert v-if="justChanged" class="border-green-200 bg-green-50">
        <CheckCircle2 class="h-4 w-4 text-green-600" />
        <AlertDescription class="text-green-800">
          Password changed successfully! Your account is now secured with the new password.
        </AlertDescription>
      </Alert>

      <!-- Change Password Card -->
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password. This action requires password confirmation for security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div class="space-y-2">
              <Label for="current-password">Current Password</Label>
              <Input
                id="current-password"
                v-model="formData.current_password"
                type="password"
                placeholder="Enter your current password"
                autocomplete="new-password"
                required
                :disabled="isLoading"
                @input="updateValidation"
              />
              <!-- Same password error -->
              <div v-if="validationErrors.samePassword" class="text-sm text-red-600">
                New password must be different from current password
              </div>
            </div>

            <div class="space-y-2">
              <Label for="new-password">New Password</Label>
              <Input
                id="new-password"
                v-model="formData.password"
                type="password"
                placeholder="Enter your new password"
                autocomplete="new-password"
                required
                :disabled="isLoading"
                @input="updatePasswordStrength"
                :class="{ 'border-red-500': validationErrors.passwordTooShort }"
              />
              <!-- Password too short error -->
              <div v-if="validationErrors.passwordTooShort" class="text-sm text-red-600">
                Password must be at least 8 characters long
              </div>
              
              <!-- Password Strength Indicator -->
              <div v-if="formData.password" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-muted-foreground">Password strength:</span>
                  <span 
                    class="font-medium"
                    :class="{
                      'text-red-600': passwordStrength.score < 40,
                      'text-yellow-600': passwordStrength.score >= 40 && passwordStrength.score < 70,
                      'text-green-600': passwordStrength.score >= 70
                    }"
                  >
                    {{ passwordStrength.label }}
                  </span>
                </div>
                <Progress 
                  :value="passwordStrength.score" 
                  class="w-full h-2"
                  :class="{
                    '[&>div]:bg-red-500': passwordStrength.score < 40,
                    '[&>div]:bg-yellow-500': passwordStrength.score >= 40 && passwordStrength.score < 70,
                    '[&>div]:bg-green-500': passwordStrength.score >= 70
                  }"
                />
                
                <!-- Password Requirements -->
                <div class="text-xs space-y-1">
                  <div class="flex items-center gap-2">
                    <span :class="passwordStrength.checks.length ? 'text-green-600' : 'text-muted-foreground'">
                      {{ passwordStrength.checks.length ? '✓' : '○' }}
                    </span>
                    <span>At least 8 characters</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="passwordStrength.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'">
                      {{ passwordStrength.checks.lowercase ? '✓' : '○' }}
                    </span>
                    <span>One lowercase letter</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="passwordStrength.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'">
                      {{ passwordStrength.checks.uppercase ? '✓' : '○' }}
                    </span>
                    <span>One uppercase letter</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="passwordStrength.checks.numbers ? 'text-green-600' : 'text-muted-foreground'">
                      {{ passwordStrength.checks.numbers ? '✓' : '○' }}
                    </span>
                    <span>One number</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="passwordStrength.checks.special ? 'text-green-600' : 'text-muted-foreground'">
                      {{ passwordStrength.checks.special ? '✓' : '○' }}
                    </span>
                    <span>One special character</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                v-model="formData.password_confirmation"
                type="password"
                placeholder="Confirm your new password"
                autocomplete="new-password"
                required
                :disabled="isLoading"
                @input="updateValidation"
                :class="{ 'border-red-500': validationErrors.passwordMismatch }"
              />
              <!-- Password mismatch error -->
              <div v-if="validationErrors.passwordMismatch" class="text-sm text-red-600">
                Passwords do not match
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <Button 
                type="submit"
                :disabled="isLoading || !isFormValid()"
              >
                {{ isLoading ? 'Changing Password...' : 'Change Password' }}
              </Button>
              <Button 
                type="button"
                variant="outline"
                @click="clearForm"
                :disabled="isLoading || !hasFormData()"
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </SettingsLayout>
</template> 