<script setup>
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import RegisterForm from '../components/RegisterForm.vue'
import AuthTips from '../components/AuthTips.vue'

// SEO meta data for register page
useHead({
  title: 'Create Account - Laravel App',
  meta: [
    { name: 'description', content: 'Create your Laravel App account to access your dashboard and manage your profile.' },
    { name: 'keywords', content: 'register, sign up, create account, laravel, authentication, user registration' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed
    { property: 'og:title', content: 'Create Account - Laravel App' },
    { property: 'og:description', content: 'Join thousands of users using our Laravel application.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Create Account - Laravel App' },
    { name: 'twitter:description', content: 'Start your journey with our Laravel application today.' }
  ]
})

const router = useRouter()

const handleRegisterSuccess = (userData) => {
  // Registration successful, redirect handled by component
  
  // Check if email verification is required
  if (userData && userData.email_verified_at === null) {
    // Redirect to email verification page
    router.push('/email/verify')
  } else {
    // Email is already verified or verification is not required
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="register" />
    </div>
    
    <!-- Form Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">      
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <RegisterForm @success="handleRegisterSuccess" />
        </div>
      </div>
    </div>
  </div>
</template> 