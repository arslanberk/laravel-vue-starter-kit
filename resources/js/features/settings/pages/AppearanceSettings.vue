<script setup>
import { useHead } from '@vueuse/head'
import { useTheme, THEME_OPTIONS } from '@/shared/composables/useTheme'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Label } from '@/shared/components/ui/label'
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import SettingsLayout from '../components/SettingsLayout.vue'

// Theme management
const { theme, setTheme, isLight, isDark, isSystem } = useTheme()

// Theme options with icons and descriptions
const themeOptions = [
  {
    value: THEME_OPTIONS.LIGHT,
    label: 'Light',
    description: 'Light theme with bright colors',
    icon: Sun
  },
  {
    value: THEME_OPTIONS.DARK,
    label: 'Dark',
    description: 'Dark theme with darker colors',
    icon: Moon
  },
  {
    value: THEME_OPTIONS.SYSTEM,
    label: 'System',
    description: 'Automatically switch based on system preference',
    icon: Monitor
  }
]

// Handle theme change
const handleThemeChange = (newTheme) => {
  setTheme(newTheme)
}

// SEO meta data for appearance settings page
useHead({
  title: 'Appearance Settings - Laravel App',
  meta: [
    { name: 'description', content: 'Customize your theme and appearance preferences.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Appearance Settings - Laravel App' },
    { property: 'og:description', content: 'Personalize your dashboard appearance and theme.' },
  ]
})
</script>

<template>
  <SettingsLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Appearance</h2>
        <p class="text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day and night themes.
        </p>
      </div>
      
      <!-- Theme Selection Card -->
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Select your preferred theme for the application interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            :model-value="theme" 
            @update:model-value="handleThemeChange"
            class="grid grid-cols-1 gap-4"
          >
            <div 
              v-for="option in themeOptions" 
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <RadioGroupItem 
                :id="option.value" 
                :value="option.value" 
              />
              <Label 
                :for="option.value" 
                class="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-accent transition-colors"
                :class="{ 'bg-accent': theme === option.value }"
              >
                <component 
                  :is="option.icon" 
                  :size="20" 
                  class="text-muted-foreground"
                />
                <div class="flex-1">
                  <div class="font-medium">{{ option.label }}</div>
                  <div class="text-sm text-muted-foreground">{{ option.description }}</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  </SettingsLayout>
</template> 