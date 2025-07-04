<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  text: {
    type: String,
    default: 'Loading...'
  }
})

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12'
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">
    <!-- Spinning circle -->
    <div 
      :class="[
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size]
      ]"
    />
    
    <!-- Loading text -->
    <p class="text-sm text-gray-600">
      {{ text }}
    </p>
  </div>
</template> 