import OverviewSettings from './pages/OverviewSettings.vue'
import ProfileSettings from './pages/ProfileSettings.vue'
import PasswordSettings from './pages/PasswordSettings.vue'
import TwoFactorSettings from './pages/TwoFactorSettings.vue'
import AppearanceSettings from './pages/AppearanceSettings.vue'

export default [
  {
    path: 'settings/overview',
    name: 'SettingsOverview',
    component: OverviewSettings,
    meta: {
      title: 'Settings Overview',
      requiresAuth: true
    }
  },
  {
    path: 'settings/profile',
    name: 'SettingsProfile',
    component: ProfileSettings,
    meta: {
      title: 'Profile Settings',
      requiresAuth: true
    }
  },
  {
    path: 'settings/password',
    name: 'SettingsPassword',
    component: PasswordSettings,
    meta: {
      title: 'Password Settings',
      requiresAuth: true
    }
  },
  {
    path: 'settings/2fa',
    name: 'Settings2FA',
    component: TwoFactorSettings,
    meta: {
      title: '2FA Settings',
      requiresAuth: true
    }
  },
  {
    path: 'settings/appearance',
    name: 'SettingsAppearance',
    component: AppearanceSettings,
    meta: {
      title: 'Appearance Settings',
      requiresAuth: true
    }
  },
  {
    // Redirect /settings to /settings/overview
    path: 'settings',
    redirect: { name: 'SettingsOverview' }
  }
] 