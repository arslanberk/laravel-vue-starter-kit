<script setup>
import { useHead } from '@vueuse/head'
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue'
import AuthTips from '../components/AuthTips.vue'

// SEO meta data for forgot password page
useHead({
  title: 'Forgot Password - Laravel App',
  meta: [
    { name: 'description', content: 'Reset your Laravel App password. Enter your email to receive password reset instructions.' },
    { name: 'keywords', content: 'forgot password, reset password, password recovery, account recovery' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed 
    { property: 'og:title', content: 'Forgot Password - Laravel App' },
    { property: 'og:description', content: 'Reset your password to regain access to your account.' },
    { property: 'og:type', content: 'website' }
  ]
})

// Success handling is done within the ForgotPasswordForm component
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="forgot-password" />
    </div>
    
    <!-- Form Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  </div>
</template> 