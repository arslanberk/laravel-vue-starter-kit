<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DrawerTitle } from "vaul-vue";
import { cn } from '@/shared/lib/utils';

const props = defineProps({
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DrawerTitle
    v-bind="delegatedProps"
    :class="
      cn('text-lg font-semibold leading-none tracking-tight', props.class)
    "
  >
    <slot />
  </DrawerTitle>
</template>
