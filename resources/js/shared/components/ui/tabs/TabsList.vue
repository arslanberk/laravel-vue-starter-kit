<script setup>
import { reactiveOmit } from "@vueuse/core";
import { TabsList } from "reka-ui";
import { cn } from '@/shared/lib/utils';

const props = defineProps({
  loop: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
