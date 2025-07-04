import { ref, computed } from 'vue'

// Theme options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark', 
  SYSTEM: 'system'
}

// Current theme state
const theme = ref(THEME_OPTIONS.SYSTEM)

// Get system preference (only when needed)
const getSystemPreference = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEME_OPTIONS.DARK 
    : THEME_OPTIONS.LIGHT
}

// Validate theme value
const isValidTheme = (value) => {
  return Object.values(THEME_OPTIONS).includes(value)
}

// Load theme from localStorage on app startup
const loadTheme = () => {
  try {
    const stored = localStorage.getItem('theme')
    if (stored && isValidTheme(stored)) {
      theme.value = stored
    } else {
      // Invalid or missing - default to system
      theme.value = THEME_OPTIONS.SYSTEM
      localStorage.setItem('theme', THEME_OPTIONS.SYSTEM)
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error)
    theme.value = THEME_OPTIONS.SYSTEM
  }
}

// Apply theme to DOM
const applyTheme = () => {
  const resolvedTheme = theme.value === THEME_OPTIONS.SYSTEM 
    ? getSystemPreference() 
    : theme.value
    
  const isDark = resolvedTheme === THEME_OPTIONS.DARK
  const htmlElement = document.documentElement
  
  if (isDark) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

// Set theme and persist
const setTheme = (newTheme) => {
  if (!isValidTheme(newTheme)) {
    console.warn(`Invalid theme: ${newTheme}`)
    return
  }
  
  theme.value = newTheme
  
  try {
    localStorage.setItem('theme', newTheme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
  
  // Apply immediately
  applyTheme()
}

// Initialize theme system (call once on app startup)
const initializeTheme = () => {
  loadTheme()
  applyTheme()
}

export function useTheme() {
  // Computed actual theme (resolves 'system' to actual preference)
  const resolvedTheme = computed(() => {
    if (theme.value === THEME_OPTIONS.SYSTEM) {
      return getSystemPreference()
    }
    return theme.value
  })
  
  return {
    theme,
    resolvedTheme,
    setTheme,
    initializeTheme,
    THEME_OPTIONS,
    // Helper functions
    isLight: computed(() => resolvedTheme.value === THEME_OPTIONS.LIGHT),
    isDark: computed(() => resolvedTheme.value === THEME_OPTIONS.DARK),
    isSystem: computed(() => theme.value === THEME_OPTIONS.SYSTEM)
  }
} 