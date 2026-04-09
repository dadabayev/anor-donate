import {
  IconBrandYoutube,
  IconChartBar,
  IconEdit,
  IconHistory,
  IconLayoutGrid,
  IconMessageCircle,
  IconPhoto,
  IconPower,
  IconSettings,
  IconUserCircle,
  IconWallet,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

export interface SidebarNavKey {
  icon: ComponentType<{ className?: string; size?: number; stroke?: number }>
  labelKey:
    | 'sidebar.primary.dashboard'
    | 'sidebar.primary.donations'
    | 'sidebar.primary.donationHistory'
    | 'sidebar.primary.widgets'
    | 'sidebar.primary.memes'
    | 'sidebar.primary.streamStatistics'
    | 'sidebar.primary.fundraising'
    | 'sidebar.primary.settings'
    | 'sidebar.primary.profile'
  path?: string
}

export const PRIMARY_NAV_KEYS: SidebarNavKey[] = [
  {
    icon: IconLayoutGrid,
    labelKey: 'sidebar.primary.dashboard',
    path: '/dashboard',
  },
  {
    icon: IconMessageCircle,
    labelKey: 'sidebar.primary.donations',
    path: '/donations',
  },
  { icon: IconHistory, labelKey: 'sidebar.primary.donationHistory' },
  { icon: IconPhoto, labelKey: 'sidebar.primary.widgets', path: '/widgets' },
  { icon: IconBrandYoutube, labelKey: 'sidebar.primary.memes', path: '/memes' },
  {
    icon: IconChartBar,
    labelKey: 'sidebar.primary.streamStatistics',
    path: '/stream-statistics',
  },
  {
    icon: IconWallet,
    labelKey: 'sidebar.primary.fundraising',
    path: '/fundraising',
  },
  {
    icon: IconSettings,
    labelKey: 'sidebar.primary.settings',
    path: '/donations/settings',
  },
  {
    icon: IconUserCircle,
    labelKey: 'sidebar.primary.profile',
    path: '/profile',
  },
]

export interface SidebarSecondaryKey {
  icon: ComponentType<{ className?: string; size?: number; stroke?: number }>
  labelKey: 'sidebar.secondary.admin'
}

export const SECONDARY_NAV_KEYS: SidebarSecondaryKey[] = [
  { icon: IconEdit, labelKey: 'sidebar.secondary.admin' },
]

export const LOGOUT_NAV_KEY = {
  icon: IconPower,
  labelKey: 'sidebar.logout' as const,
}
