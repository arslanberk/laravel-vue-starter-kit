<script setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'

import { useBreadcrumb } from '@/shared/composables/useBreadcrumb'
const { breadcrumbItems } = useBreadcrumb()
</script>

<template>
  <Breadcrumb v-if="breadcrumbItems.length > 0">
    <BreadcrumbList>
      <template v-for="(item, index) in breadcrumbItems" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink v-if="item.href" :href="item.href">
            {{ item.label }}
          </BreadcrumbLink>
          <BreadcrumbPage v-else>
            {{ item.label }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template> 