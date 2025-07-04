<template>
  <div class="flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold" :class="className">
    <span class="text-sm">L</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: 'h-8 w-8'
})
</script> 