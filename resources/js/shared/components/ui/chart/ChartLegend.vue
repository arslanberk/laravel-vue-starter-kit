<script setup>
import { BulletLegend } from "@unovis/ts";
import { VisBulletLegend } from "@unovis/vue";
import { nextTick, onMounted, ref } from "vue";
import { buttonVariants } from '@/shared/components/ui/button';

const props = defineProps({
  items: { type: Array, required: true, default: () => [] },
});

const emits = defineEmits(["legendItemClick", "update:items"]);

const elRef = ref();

function keepStyling() {
  const selector = `.${BulletLegend.selectors.item}`;
  nextTick(() => {
    const elements = elRef.value?.querySelectorAll(selector);
    const classes = buttonVariants({ variant: "ghost", size: "xs" }).split(" ");

    elements?.forEach((el) =>
      el.classList.add(...classes, "!inline-flex", "!mr-2"),
    );
  });
}

onMounted(() => {
  keepStyling();
});

function onLegendItemClick(d, i) {
  emits("legendItemClick", d, i);
  const isBulletActive = !props.items[i].inactive;
  const isFilterApplied = props.items.some((i) => i.inactive);
  if (isFilterApplied && isBulletActive) {
    // reset filter
    emits(
      "update:items",
      props.items.map((item) => ({ ...item, inactive: false })),
    );
  } else {
    // apply selection, set other item as inactive
    emits(
      "update:items",
      props.items.map((item) =>
        item.name === d.name
          ? { ...d, inactive: false }
          : { ...item, inactive: true },
      ),
    );
  }
  keepStyling();
}
</script>

<template>
  <div
    ref="elRef"
    class="w-max"
    :style="{
      '--vis-legend-bullet-size': '16px',
    }"
  >
    <VisBulletLegend :items="items" :on-legend-item-click="onLegendItemClick" />
  </div>
</template>
