<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/shared/components/ui/sheet'
import { useAuth } from '@/features/auth/composables/useAuth'
import ThemeSwitcher from '@/shared/components/common/ThemeSwitcher.vue'
import ApplicationLogo from '@/shared/components/common/ApplicationLogo.vue'

// Use auth composable to get authentication state
const { isAuthenticated, isEmailVerified, logout } = useAuth()

// Handle logout action
const handleLogout = async () => {
  try {
    await logout()
    // Redirect will be handled by logout function
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script> 

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation Header -->
    <header class="border-b">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo and App Name -->
          <RouterLink to="/" >
            <div class="flex flex-row items-center gap-2 py-4">
              <ApplicationLogo class="h-8 w-8 text-primary" />
              <h1 class="font-semibold text-lg hidden sm:block">Laravel App</h1>
              <h1 class="font-semibold text-base sm:hidden">Laravel</h1>
            </div>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm">
              <RouterLink to="/">Home</RouterLink>
            </Button>
            <Separator orientation="vertical" class="h-6" />
            
            <!-- Theme Switcher -->
            <ThemeSwitcher />
            
            <!-- Show Login/Register if not authenticated -->
            <template v-if="!isAuthenticated">
              <Button variant="ghost" size="sm" asChild>
                <RouterLink to="/login">Login</RouterLink>
              </Button>
              <Button size="sm" asChild>
                <RouterLink to="/register">Register</RouterLink>
              </Button>
            </template>
            
            <!-- Show Dashboard if authenticated and email verified -->
            <template v-else-if="isEmailVerified">
              <Button variant="outline" size="sm" asChild>
                <RouterLink to="/dashboard">Dashboard</RouterLink>
              </Button>
            </template>
            
            <!-- Show Logout if authenticated but email not verified -->
            <template v-else>
              <Button variant="outline" size="sm" @click="handleLogout">
                Logout
              </Button>
            </template>
          </nav>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <Sheet>
              <SheetTrigger as-child>
                <Button variant="ghost" size="sm">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" class="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div class="flex flex-col space-y-4 mt-6">
                  <Button variant="ghost" class="justify-start">
                    <RouterLink to="/">Home</RouterLink>
                  </Button>
                  
                  <!-- Theme Switcher for Mobile -->
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Theme</span>
                    <ThemeSwitcher />
                  </div>
                  
                  <Separator />
                  
                  <!-- Show Login/Register if not authenticated -->
                  <template v-if="!isAuthenticated">
                    <Button variant="ghost" class="justify-start" asChild>
                      <RouterLink to="/login">Login</RouterLink>
                    </Button>
                    <Button class="justify-start" asChild>
                      <RouterLink to="/register">Register</RouterLink>
                    </Button>
                  </template>
                  
                  <!-- Show Dashboard if authenticated and email verified -->
                  <template v-else-if="isEmailVerified">
                    <Button variant="outline" class="justify-start" asChild>
                      <RouterLink to="/dashboard">Dashboard</RouterLink>
                    </Button>
                  </template>
                  
                  <!-- Show Logout if authenticated but email not verified -->
                  <template v-else>
                    <Button variant="outline" class="justify-start" @click="handleLogout">
                      Logout
                    </Button>
                  </template>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="border-t bg-muted/50">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Company Info -->
          <div class="md:col-span-1">
            <div class="flex flex-col space-y-4">
              <div class="flex flex-row items-center gap-2">
                <ApplicationLogo class="h-8 w-8 text-primary" />
                <span class="font-semibold">Laravel App</span>
              </div>
              <p class="text-sm text-muted-foreground">
                A modern full-stack web application built with Laravel and Vue.js.
              </p>
            </div>
            <div class="text-xs text-muted-foreground">
              © 2025 Laravel App. All rights reserved.
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold mb-4">Quick Links</h3>
            <div class="space-y-2 text-sm">
              <div>
                <Button variant="link" size="sm" class="h-auto p-0 text-muted-foreground hover:text-foreground justify-start" asChild>
                  <RouterLink to="/">Home</RouterLink>
                </Button>
              </div>
            </div>
          </div>

          <!-- Legal Links -->
          <div>
            <h3 class="font-semibold mb-4">Legal</h3>
            <div class="space-y-2 text-sm">
              <div>
                <Button variant="link" size="sm" class="h-auto p-0 text-muted-foreground hover:text-foreground justify-start" asChild>
                  <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
                </Button>
              </div>
              <div>
                <Button variant="link" size="sm" class="h-auto p-0 text-muted-foreground hover:text-foreground justify-start" asChild>
                  <RouterLink to="/terms-of-service">Terms of Service</RouterLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
