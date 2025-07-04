<script setup>
import { useTheme, THEME_OPTIONS } from '@/shared/composables/useTheme'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const { theme, setTheme, isLight, isDark } = useTheme()

// Get current theme icon
const getCurrentIcon = () => {
  if (isLight.value) return Sun
  if (isDark.value) return Moon
  return Monitor
}

// Theme options for dropdown
const themeOptions = [
  {
    value: THEME_OPTIONS.LIGHT,
    label: 'Light',
    icon: Sun
  },
  {
    value: THEME_OPTIONS.DARK,
    label: 'Dark', 
    icon: Moon
  },
  {
    value: THEME_OPTIONS.SYSTEM,
    label: 'System',
    icon: Monitor
  }
]

// Handle theme selection
const handleThemeSelect = (selectedTheme) => {
  setTheme(selectedTheme)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 w-8 p-0 rounded-full">
        <component :is="getCurrentIcon()" :size="16" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="option in themeOptions"
        :key="option.value"
        @click="handleThemeSelect(option.value)"
        class="flex items-center gap-2 cursor-pointer"
        :class="{ 'bg-accent': theme === option.value }"
      >
        <component :is="option.icon" :size="16" />
        {{ option.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template> 