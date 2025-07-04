<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { authApi } from '@/features/auth/api'
import { useAuth } from '@/features/auth/composables/useAuth'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { toast } from 'vue-sonner'
import { CheckCircle2, AlertCircle, User, Mail, Shield } from 'lucide-vue-next'
import SettingsLayout from '../components/SettingsLayout.vue'

// Auth state
const { user, checkAuth } = useAuth()

// Form state
const isLoading = ref(false)
const error = ref('')
const justUpdated = ref(false)
const formData = ref({
  name: '',
  email: ''
})

// Initialize form with user data
const initializeForm = () => {
  if (user.value) {
    formData.value = {
      name: user.value.name || '',
      email: user.value.email || ''
    }
  }
}

// Update profile - refresh auth state after update
const updateProfile = async () => {
  if (!formData.value.name.trim() || !formData.value.email.trim()) {
    error.value = 'Name and email are required'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authApi.profile.update({
      name: formData.value.name.trim(),
      email: formData.value.email.trim()
    })

    toast.success('Profile updated successfully!')
    justUpdated.value = true
    
    // Clear success state after 3 seconds
    setTimeout(() => {
      justUpdated.value = false
    }, 3000)

    // Refresh auth store with updated user data
    // This updates user info across the entire application
    // If email was changed, this will also update email verification status
    try {
      await checkAuth()
    } catch (authErr) {
      // Profile update succeeded, but auth refresh failed
      // This is not critical - user data will be refreshed on next page load
      console.warn('Auth refresh failed after profile update:', authErr)
    }
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update profile'
    toast.error('Failed to update profile')
  } finally {
    isLoading.value = false
  }
}

// Reset form to original values
const resetForm = () => {
  initializeForm()
  error.value = ''
}

// Check if form has changes
const hasChanges = () => {
  if (!user.value) return false
  return formData.value.name !== user.value.name || 
         formData.value.email !== user.value.email
}

// Form validation
const isNameValid = computed(() => formData.value.name.trim().length >= 2)
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(formData.value.email.trim())
})
const isFormValid = computed(() => isNameValid.value && isEmailValid.value)

// Initialize
onMounted(() => {
  initializeForm()
})

// SEO meta data for profile settings page
useHead({
  title: 'Profile Settings - Laravel App',
  meta: [
    { name: 'description', content: 'Manage your profile information and account details.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Profile Settings - Laravel App' },
    { property: 'og:description', content: 'Update your profile and account preferences.' },
  ]
})
</script>

<template>
  <SettingsLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Profile</h2>
        <p class="text-muted-foreground">
          Manage your profile information and account details.
        </p>
      </div>

      <!-- Error Alert -->
      <Alert v-if="error" variant="destructive">
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Success Alert -->
      <Alert v-if="justUpdated" class="border-green-200 bg-green-50">
        <CheckCircle2 class="h-4 w-4 text-green-600" />
        <AlertDescription class="text-green-800">
          Profile updated successfully! Changes will be reflected across your account.
        </AlertDescription>
      </Alert>

      <!-- Profile Information Card -->
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile details. Email changes require password confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <User :size="16" class="text-muted-foreground" />
                <Label for="name">Full Name</Label>
              </div>
              <Input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Enter your full name"
                required
                :disabled="isLoading"
                :class="formData.name && !isNameValid ? 'border-red-500' : ''"
              />
              <p v-if="formData.name && !isNameValid" class="text-xs text-red-500">
                Name must be at least 2 characters long
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <Mail :size="16" class="text-muted-foreground" />
                <Label for="email">Email Address</Label>
              </div>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="Enter your email address"
                required
                :disabled="isLoading"
                :class="formData.email && !isEmailValid ? 'border-red-500' : ''"
              />
              <div class="space-y-1">
                <p v-if="formData.email && !isEmailValid" class="text-xs text-red-500">
                  Please enter a valid email address
                </p>
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <Button 
                type="submit"
                :disabled="isLoading || !hasChanges() || !isFormValid"
              >
                {{ isLoading ? 'Updating...' : 'Update Profile' }}
              </Button>
              <Button 
                type="button"
                variant="outline"
                @click="resetForm"
                :disabled="isLoading || !hasChanges()"
              >
                Cancel
              </Button>
            </div>
            
            <!-- Form validation status -->
            <div v-if="hasChanges() && !isFormValid" class="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle :size="16" class="text-yellow-500" />
              Please fix the validation errors above before submitting
            </div>
          </form>
        </CardContent>
      </Card>


    </div>
  </SettingsLayout>
</template> 