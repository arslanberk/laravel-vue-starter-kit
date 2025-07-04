<script setup>
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'
import { LayoutDashboard, User, Lock, Shield, Palette } from 'lucide-vue-next'
import { useBreadcrumb } from '@/shared/composables/useBreadcrumb'
import { useHead } from '@vueuse/head'

// Set breadcrumbs for all settings pages
useBreadcrumb([
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings' }
])

// SEO meta data for settings pages
useHead({
  title: 'Settings - Laravel App',
  meta: [
    { name: 'description', content: 'Manage your account settings and preferences.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Settings - Laravel App' },
    { property: 'og:description', content: 'Manage your account settings and preferences.' },
  ]
})

const route = useRoute()

// Settings navigation items
const settingsNavItems = [
  {
    title: 'Overview',
    href: '/dashboard/settings/overview',
    icon: LayoutDashboard,
    description: 'Account overview and security status'
  },
  {
    title: 'Profile',
    href: '/dashboard/settings/profile',
    icon: User,
    description: 'Manage your account details and preferences'
  },
  {
    title: 'Password',
    href: '/dashboard/settings/password',
    icon: Lock,
    description: 'Update your password and security settings'
  },
  {
    title: '2FA',
    href: '/dashboard/settings/2fa',
    icon: Shield,
    description: 'Enable two-factor authentication'
  },
  {
    title: 'Appearance',
    href: '/dashboard/settings/appearance',
    icon: Palette,
    description: 'Customize your theme and appearance'
  }
]

// Determine which navigation item is currently active
const isActiveNavItem = (href) => {
  return route.path === href
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
      <p class="text-muted-foreground">
        Manage your account settings and set e-mail preferences.
      </p>
    </div>

    <!-- Content Layout: Sidebar + Main Content -->
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <!-- Sidebar Navigation -->
      <aside class="lg:w-1/5">
        <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <RouterLink
            v-for="item in settingsNavItems"
            :key="item.href"
            :to="item.href"
            class="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 justify-start"
            :class="{
              'bg-muted': isActiveNavItem(item.href),
              'transparent': !isActiveNavItem(item.href)
            }"
          >
            <component :is="item.icon" class="mr-2 h-4 w-4" />
            {{ item.title }}
          </RouterLink>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 lg:max-w-2xl">
        <slot />
      </div>
    </div>
  </div>
</template> 