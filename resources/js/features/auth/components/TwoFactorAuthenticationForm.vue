<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PinInput, PinInputGroup, PinInputSlot } from '@/shared/components/ui/pin-input'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Shield, Clock, AlertCircle } from 'lucide-vue-next'
import { authApi } from '../api'
import { useAuth } from '../composables/useAuth'
import { toast } from 'vue-sonner'

const router = useRouter()
const { checkAuth } = useAuth()

// State
const code = ref([])
const isLoading = ref(false)
const error = ref('')

// Auto-submit is handled by PinInput @complete event - no watch needed

// Handle form submission
const handleSubmit = async () => {
  if (!code.value || code.value.length !== 6 || code.value.some(digit => !digit)) {
    error.value = 'Please enter all 6 digits'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    // Join the code array into a string
    const codeString = code.value.join('')
    
    // Submit 2FA challenge
    await authApi.twoFactor.challenge(codeString)
    
    // Refresh user auth state to get updated user info
    await checkAuth()
    
    // Show success message
    toast.success('Authentication successful!', {
      description: 'You have been signed in successfully.'
    })
    
    // Let router guards handle the redirect based on user's complete auth status
    // Navigate to dashboard route - guards will redirect to email verification if needed
    router.replace('/dashboard')
    
  } catch (err) {
    console.error('2FA verification failed:', err)
    
    // Handle different error types
    if (err.response?.status === 422) {
      error.value = 'Invalid code. Please check your authenticator app and try again.'
    } else if (err.response?.status === 429) {
      error.value = 'Too many attempts. Please wait before trying again.'
    } else {
      error.value = err.response?.data?.message || 'Verification failed. Please try again.'
    }
    
    // Clear the code so user can enter again
    code.value = []
    
    // Show error toast
    toast.error('Verification failed', {
      description: error.value
    })
  } finally {
    isLoading.value = false
  }
}

// Manual submit (fallback if auto-submit fails)
const handleManualSubmit = async () => {
  await handleSubmit()
}

</script>

<template>
  <div class="flex flex-col gap-6 text-center">
    <!-- Security icon -->
    <div class="flex justify-center">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
        <Shield class="h-6 w-6 text-blue-600" />
      </div>
    </div>
    
    <!-- Page title and description -->
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">Two-Factor Authentication</h1>
      <p class="text-sm text-muted-foreground">
        Enter the 6-digit code from your authenticator app to complete sign in
      </p>
    </div>
    
    <!-- Error Alert -->
    <Alert v-if="error" variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>{{ error }}</AlertDescription>
    </Alert>
    
    <!-- PIN Input -->
    <div class="space-y-4">
      <div class="flex justify-center">
        <PinInput 
          v-model="code" 
          :disabled="isLoading"
          otp
          type="number" 
          placeholder="○"
          @complete="handleSubmit"
          class="gap-3"
        >
          <PinInputGroup class="gap-x-3">
            <PinInputSlot 
              v-for="(id, index) in 6" 
              :key="id" 
              :index="index"
              class="w-12 h-12 text-lg border-2 rounded-lg text-foreground bg-background"
            />
          </PinInputGroup>
        </PinInput>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-4">
      <!-- Manual submit button -->
      <Button 
        @click="handleManualSubmit" 
        :disabled="isLoading || code.length !== 6 || code.some(digit => !digit)"
        class="w-full"
      >
        {{ isLoading ? 'Verifying...' : 'Verify Code' }}
      </Button>
    </div>
    
    <!-- Help text -->
    <div class="text-center">
      <p class="text-sm text-muted-foreground">
        Can't access your authenticator app? Contact support for assistance.
      </p>
    </div>
  </div>
</template> 