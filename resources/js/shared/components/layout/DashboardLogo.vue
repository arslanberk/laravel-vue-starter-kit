<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar'
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        as-child
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <RouterLink to="/dashboard">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <div class="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-sm">YT</span>
            </div>
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <div class="flex flex-col">
              <span class="font-semibold text-sm">Laravel App</span>
              <span class="truncate text-xs">Dashboard</span>
            </div>
          </div>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>