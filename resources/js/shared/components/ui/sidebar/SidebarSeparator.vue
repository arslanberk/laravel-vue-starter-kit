<script setup>
import { cn } from '@/shared/lib/utils';
import { Separator } from '@/shared/components/ui/separator';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <Separator
    data-sidebar="separator"
    :class="cn('mx-2 w-auto bg-sidebar-border', props.class)"
  >
    <slot />
  </Separator>
</template>
