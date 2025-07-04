<script setup>
import { useHead } from '@vueuse/head'
import { useAuth } from '@/features/auth/composables/useAuth'

// SEO meta data for dashboard
useHead({
  title: 'Dashboard - Laravel App',
  meta: [
    { name: 'description', content: 'Your personal dashboard with account management and analytics.' },
    { name: 'keywords', content: 'dashboard, account, analytics, laravel, user management' },
    { name: 'robots', content: 'noindex, nofollow' }, // Private dashboard shouldn't be indexed
    { property: 'og:title', content: 'Dashboard - Laravel App' },
    { property: 'og:description', content: 'Manage your account and access your personal dashboard.' },
  ]
})

const { user, isAuthenticated } = useAuth()
import { useBreadcrumb } from '@/shared/composables/useBreadcrumb'

// Option 1: Set breadcrumbs directly in composable call
useBreadcrumb([
  { label: 'Dashboard' }
])
</script>

<template>
  <h1>Dashboard</h1>
  <div class="grid auto-rows-min gap-4 md:grid-cols-3">
    <div class="aspect-video rounded-xl bg-muted/50" />
    <div class="aspect-video rounded-xl bg-muted/50" />
    <div class="aspect-video rounded-xl bg-muted/50" />
  </div>
  <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
</template> 