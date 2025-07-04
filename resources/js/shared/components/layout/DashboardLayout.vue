<script setup>
import { RouterView } from 'vue-router'

import { Separator } from '@/shared/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar'
import DashboardBreadcrumb from './DashboardBreadcrumb.vue'
import DashboardSidebar from './DashboardSidebar.vue'
import ThemeSwitcher from '../common/ThemeSwitcher.vue'
</script>

<template>
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <DashboardBreadcrumb />
        </div>
        <div class="flex items-center gap-2 px-4">
          <ThemeSwitcher />
        </div>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template> 