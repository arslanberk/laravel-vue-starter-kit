<script setup>
import { RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar'

const props = defineProps({
  /**
   * Navigation items array
   * Each item can have: { title, url, icon, isActive?, items? }
   * - title: Display name
   * - url: Vue Router path (e.g., '/dashboard', '/dashboard/settings')
   * - icon: Vue component for icon
   * - isActive: Whether this item is currently active
   * - items: Sub-items array (for collapsible sections)
   */
  items: {
    type: Array,
    required: true,
  },
  
  /**
   * Title/label for this navigation section
   * If not provided, no group label will be shown
   */
  title: {
    type: String,
    default: null,
  },
  
  /**
   * Whether this navigation section should be hidden when sidebar is collapsed
   * true = hidden when collapsed (like Projects section)
   * false = show icons when collapsed (like Platform section)
   */
  hideWhenCollapsed: {
    type: Boolean,
    default: false,
  },
})

// Compute the conditional class for collapse behavior
const groupClass = props.hideWhenCollapsed ? 'group-data-[collapsible=icon]:hidden' : ''
</script>

<template>
  <SidebarGroup :class="groupClass">
    <!-- Only show group label if title is provided -->
    <SidebarGroupLabel v-if="title">{{ title }}</SidebarGroupLabel>
    
    <SidebarMenu>
      <!-- Handle items with sub-items (collapsible) -->
      <template v-for="item in items" :key="item.title">
        <!-- Collapsible item with sub-items -->
        <Collapsible
          v-if="item.items && item.items.length > 0"
          as-child
          :default-open="item.isActive"
          class="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton :tooltip="item.title">
                <component :is="item.icon" v-if="item.icon" />
                <span>{{ item.title }}</span>
                <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="subItem in item.items"
                  :key="subItem.title"
                >
                  <SidebarMenuSubButton as-child>
                    <RouterLink :to="subItem.url">
                      <span>{{ subItem.title }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        
        <!-- Simple item without sub-items -->
        <SidebarMenuItem v-else>
          <SidebarMenuButton as-child>
            <RouterLink :to="item.url">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </template>
    </SidebarMenu>
  </SidebarGroup>
</template> 