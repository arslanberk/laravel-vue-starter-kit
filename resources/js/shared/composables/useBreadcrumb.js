import { ref, readonly } from 'vue'

// Global breadcrumb state - shared across all components
const breadcrumbItems = ref([])

/**
 * Breadcrumb composable for managing navigation breadcrumbs
 * 
 * @param {Array} items - Optional initial breadcrumb items
 * @returns {Object} - Breadcrumb state and methods
 * 
 * Usage:
 * // In page component
 * useBreadcrumb([
 *   { label: 'Dashboard', href: '/dashboard' },
 *   { label: 'Dashboard' } // Current page (no href)
 * ])
 * 
 * // In layout component
 * const { breadcrumbItems } = useBreadcrumb()
 */
export function useBreadcrumb(items = null) {
  /**
   * Set breadcrumb items
   * @param {Array} newItems - Array of breadcrumb objects { label, href? }
   */
  const setBreadcrumb = (newItems) => {
    breadcrumbItems.value = newItems || []
  }

  /**
   * Clear all breadcrumb items
   */
  const clearBreadcrumb = () => {
    breadcrumbItems.value = []
  }

  /**
   * Add a single breadcrumb item to the end
   * @param {Object} item - Breadcrumb object { label, href? }
   */
  const addBreadcrumb = (item) => {
    breadcrumbItems.value.push(item)
  }

  // Convenience: set breadcrumbs if provided directly to composable
  if (items) {
    setBreadcrumb(items)
  }

  return {
    breadcrumbItems: readonly(breadcrumbItems), // Prevent direct mutations
    setBreadcrumb,
    clearBreadcrumb,
    addBreadcrumb
  }
} 