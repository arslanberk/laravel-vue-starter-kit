import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { router } from '@/shared/lib/router'
import { useTheme } from '@/shared/composables/useTheme'
import App from './App.vue'

// CSS
import '../css/app.css'

// Initialize theme system before app starts
const { initializeTheme } = useTheme()
initializeTheme()

// Create Vue app
const app = createApp(App)

// Setup Vue Router
app.use(router)

// Setup Pinia store
const pinia = createPinia()
app.use(pinia)

// Create Vue use head
const head = createHead()
app.use(head)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global Vue error:', error, info)
  // TODO: Send to error reporting service in production
}

// Mount the app
app.mount('#app') 