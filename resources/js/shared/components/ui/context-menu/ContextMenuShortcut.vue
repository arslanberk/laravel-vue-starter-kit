<script setup>
import { cn } from '@/shared/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <span
    :class="
      cn('ml-auto text-xs tracking-widest text-muted-foreground', props.class)
    "
  >
    <slot />
  </span>
</template>
