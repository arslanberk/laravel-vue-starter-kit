<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from '@/shared/components/ui/sonner'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner.vue'
import PasswordConfirmationDialog from '@/features/auth/components/PasswordConfirmationDialog.vue'
import { useAuth } from '@/features/auth/composables/useAuth'
import 'vue-sonner/style.css'

// Get auth state for loading display - router handles initialization
const { isLoading, isAuthChecked, initializeAuth } = useAuth()

onMounted(async () => {
  await initializeAuth()
})
</script>

<template>
  <div id="app">
    <!-- Show loading spinner while auth is being checked by router -->
    <div 
      v-if="isLoading && !isAuthChecked" 
      class="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <LoadingSpinner 
        size="lg" 
        text="Loading..." 
      />
    </div>
    <!-- Show app content after auth check completes -->
    <div v-else>
      <RouterView />
    </div>
    <!-- Toast notifications -->
    <Toaster />
    
    <!-- Global password confirmation dialog -->
    <PasswordConfirmationDialog />
  </div>
</template>

<style>
/* Global styles can go here if needed */
</style> 