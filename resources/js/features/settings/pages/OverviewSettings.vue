<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Calendar, Clock, Mail, Lock, Shield, CheckCircle2, AlertCircle, User, AlertTriangle } from 'lucide-vue-next'
import SettingsLayout from '../components/SettingsLayout.vue'

// Get user data from auth store
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// SEO meta data for overview settings page
useHead({
  title: 'Settings Overview - Laravel App',
  meta: [
    { name: 'description', content: 'Overview of your account settings and status.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Settings Overview - Laravel App' },
    { property: 'og:description', content: 'Manage your account settings and view your profile status.' },
  ]
})
</script>

<template>
  <SettingsLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Settings Overview</h2>
        <p class="text-muted-foreground">
          View your account status and manage your settings.
        </p>
      </div>

      <!-- Account Information Card -->
      <Card v-if="user">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and verification status.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center gap-3">
              <Calendar :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium">Account Created</Label>
                <p class="text-sm text-muted-foreground">
                  {{ new Date(user.created_at).toLocaleDateString() }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <Mail :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium">Email Verification</Label>
                <div class="flex items-center gap-2">
                  <Badge :variant="user.email_verified_at ? 'default' : 'secondary'">
                    <CheckCircle2 v-if="user.email_verified_at" :size="12" class="mr-1" />
                    <Clock v-else :size="12" class="mr-1" />
                    {{ user.email_verified_at ? 'Verified' : 'Pending' }}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <Shield :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium">2FA Authentication</Label>
                <div class="flex items-center gap-2">
                  <Badge :variant="user.two_factor_enabled ? 'default' : 'secondary'">
                    <CheckCircle2 v-if="user.two_factor_enabled" :size="12" class="mr-1" />
                    <AlertCircle v-else :size="12" class="mr-1" />
                    {{ user.two_factor_enabled ? 'Enabled' : 'Disabled' }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Recommendations -->
          <Alert v-if="!user?.email_verified_at || !user?.two_factor_enabled" class="mt-6" variant="destructive">
            <AlertTriangle :size="16" />
            <AlertTitle>Security Recommendations</AlertTitle>
            <AlertDescription>
              <ul class="space-y-1 mt-2">
                <li v-if="!user?.email_verified_at">• Verify your email address to secure your account</li>
                <li v-if="!user?.two_factor_enabled">• Enable two-factor authentication for extra security</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert v-else class="mt-6">
            <CheckCircle2 :size="16" />
            <AlertTitle>Account Secure</AlertTitle>
            <AlertDescription>
              Your account has all recommended security features enabled.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <!-- Quick Settings Actions Card -->
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common settings and account management actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RouterLink 
              to="/dashboard/settings/profile" 
              class="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium cursor-pointer">Update Profile</Label>
                <p class="text-xs text-muted-foreground">Change your name and email</p>
              </div>
            </RouterLink>

            <RouterLink 
              to="/dashboard/settings/password" 
              class="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Lock :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium cursor-pointer">Change Password</Label>
                <p class="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </RouterLink>

            <RouterLink 
              to="/dashboard/settings/two-factor" 
              class="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Shield :size="20" class="text-muted-foreground" />
              <div>
                <Label class="text-sm font-medium cursor-pointer">2FA Authentication</Label>
                <p class="text-xs text-muted-foreground">
                  {{ user?.two_factor_enabled ? 'Manage 2FA settings' : 'Enable extra security' }}
                </p>
              </div>
            </RouterLink>
          </div>
        </CardContent>
      </Card>


    </div>
  </SettingsLayout>
</template> 