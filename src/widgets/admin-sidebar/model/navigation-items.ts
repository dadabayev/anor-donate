import {
  IconExternalLink,
  IconFolders,
  IconLayoutGrid,
  IconNews,
  IconPhoto,
  IconPower,
  IconShieldCheck,
  IconTypography,
  IconUsers,
} from '@tabler/icons-react'
import type { ComponentType } from 'react'

export interface AdminNavItem {
  icon: ComponentType<{ className?: string; size?: number; stroke?: number }>
  labelKey:
    | 'admin.nav.dashboard'
    | 'admin.nav.customers'
    | 'admin.nav.moderation'
    | 'admin.nav.tts'
    | 'admin.nav.memeCategories'
    | 'admin.nav.memes'
    | 'admin.nav.news'
  path: string
}

export const ADMIN_PRIMARY_NAV: AdminNavItem[] = [
  {
    icon: IconLayoutGrid,
    labelKey: 'admin.nav.dashboard',
    path: '/admin',
  },
  {
    icon: IconUsers,
    labelKey: 'admin.nav.customers',
    path: '/admin/customers',
  },
  {
    icon: IconShieldCheck,
    labelKey: 'admin.nav.moderation',
    path: '/admin/moderation',
  },
  {
    icon: IconTypography,
    labelKey: 'admin.nav.tts',
    path: '/admin/tts',
  },
  {
    icon: IconFolders,
    labelKey: 'admin.nav.memeCategories',
    path: '/admin/meme-categories',
  },
  {
    icon: IconPhoto,
    labelKey: 'admin.nav.memes',
    path: '/admin/memes',
  },
  {
    icon: IconNews,
    labelKey: 'admin.nav.news',
    path: '/admin/news',
  },
]

export const ADMIN_GO_TO_SITE = {
  icon: IconExternalLink,
  labelKey: 'admin.nav.goToSite' as const,
}

export const ADMIN_LOGOUT = {
  icon: IconPower,
  labelKey: 'sidebar.logout' as const,
}
