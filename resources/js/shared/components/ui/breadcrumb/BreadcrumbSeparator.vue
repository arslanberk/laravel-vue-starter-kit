<script setup>
import { ChevronRight } from "lucide-vue-next";
import { cn } from '@/shared/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    :class="cn('[&>svg]:size-3.5', props.class)"
  >
    <slot>
      <ChevronRight />
    </slot>
  </li>
</template>
