<script setup>
import { cn } from '@/shared/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <tbody :class="cn('[&_tr:last-child]:border-0', props.class)">
    <slot />
  </tbody>
</template>
