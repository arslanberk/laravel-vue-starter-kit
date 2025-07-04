<script setup>
import { useHead } from '@vueuse/head'
import PasswordResetForm from '../components/PasswordResetForm.vue'
import AuthTips from '../components/AuthTips.vue'

// SEO meta data for password reset page
useHead({
  title: 'Reset Password - Laravel App',
  meta: [
    { name: 'description', content: 'Create a new secure password for your Laravel App account.' },
    { name: 'keywords', content: 'reset password, new password, change password, update password' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed
    { property: 'og:title', content: 'Reset Password - Laravel App' },
    { property: 'og:description', content: 'Secure your account by creating a strong new password.' },
    { property: 'og:type', content: 'website' }
  ]
})

// Success handling is done within the PasswordResetForm component
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="password-reset" />
    </div>
    
    <!-- Form Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <PasswordResetForm />
        </div>
      </div>
    </div>
  </div>
</template> 