<script setup>
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { toast } from 'vue-sonner'
import LoginForm from '../components/LoginForm.vue'
import AuthTips from '../components/AuthTips.vue'

// SEO meta data for login page
useHead({
  title: 'Sign In - Laravel App',
  meta: [
    { name: 'description', content: 'Sign in to your Laravel App account to access your dashboard and manage your profile.' },
    { name: 'keywords', content: 'login, sign in, laravel, authentication, user account' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private auth pages shouldn't be indexed
    { property: 'og:title', content: 'Sign In - Laravel App' },
    { property: 'og:description', content: 'Access your account dashboard and manage your profile.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Sign In - Laravel App' },
    { name: 'twitter:description', content: 'Sign in to access your Laravel application dashboard.' }
  ]
})

const router = useRouter()

const handleLoginSuccess = (user) => {
  // Show success message
  toast.success(`Welcome back, ${user.name}!`)
  
  // Check if email is verified
  if (!user.email_verified_at) {
    toast.info('Please verify your email address to access all features.')
  }
  
  // Redirect to dashboard
  router.push('/dashboard')
}

const handleTwoFactorRequired = () => {
  // Show info message
  toast.info('Two-factor authentication required', {
    description: 'Please enter your authenticator code to complete sign in.'
  })
  
  // Redirect to 2FA authentication page
  router.push('/two-factor-authentication')
}
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <!-- Tips Section - Left Side -->
    <div class="relative hidden lg:block">
      <AuthTips type="login" />
    </div>
    
    <!-- Form Section - Right Side -->
    <div class="flex flex-col gap-4 p-6 md:p-10">      
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm">
          <LoginForm 
            @success="handleLoginSuccess" 
            @two-factor-required="handleTwoFactorRequired"
          />
        </div>
      </div>
    </div>
  </div>
</template> 