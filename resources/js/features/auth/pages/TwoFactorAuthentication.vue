<script setup>
import { useHead } from '@vueuse/head'
import TwoFactorAuthenticationForm from '../components/TwoFactorAuthenticationForm.vue'
import AuthTips from '../components/AuthTips.vue'

// SEO meta data for 2FA verification page
useHead({
  title: 'Two-Factor Authentication - Laravel App',
  meta: [
    { name: 'description', content: 'Enter your two-factor authentication code to complete sign in to your Laravel App account.' },
    { name: 'keywords', content: 'two factor authentication, 2fa, security code, authenticator app' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed
    { property: 'og:title', content: 'Two-Factor Authentication - Laravel App' },
    { property: 'og:description', content: 'Complete your secure sign in with two-factor authentication.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<template>
  <!-- Consistent two-column layout for all auth pages -->
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="two-factor" />
    </div>
    
    <!-- Content Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <!-- Two-Factor Authentication Form -->
          <TwoFactorAuthenticationForm />
        </div>
      </div>
    </div>
  </div>
</template> 