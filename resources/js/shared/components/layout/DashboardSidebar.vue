<script setup>
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/components/ui/sidebar'
import DashboardLogo from './DashboardLogo.vue'
import DashboardNav from './DashboardNav.vue'
import DashboardNavUser from './DashboardNavUser.vue'

const props = defineProps({
  collapsible: {
    type: String,
    default: 'icon',
  }
})

// This is sample data.
const navPrimary = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareTerminal,
    isActive: true,
  },
]
const navSecondary = [
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    items: [
      {
        title: 'General',
        url: '#',
      },
      {
        title: 'Team',
        url: '#',
      },
      {
        title: 'Billing',
        url: '#',
      },
      {
        title: 'Limits',
        url: '#',
      },
    ],
  },
]

</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <DashboardLogo/>
    </SidebarHeader>
    <SidebarContent>
      <DashboardNav title="Platform" :items="navPrimary" :hideWhenCollapsed="false"/>
      <DashboardNav title="Settings" :items="navSecondary" :hideWhenCollapsed="false"/>
    </SidebarContent>
    <SidebarFooter>
      <DashboardNavUser />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
