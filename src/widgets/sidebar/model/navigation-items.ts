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

export interface SidebarItem {
  icon: ComponentType<{ className?: string; size?: number; stroke?: number }>
  label: string
  path?: string
}

export const PRIMARY_ITEMS: SidebarItem[] = [
  { icon: IconLayoutGrid, label: 'Bosh menyu', path: '/dashboard' },
  { icon: IconMessageCircle, label: 'Donatlar', path: '/donations' },
  { icon: IconHistory, label: 'Donatlar Tarixi' },
  { icon: IconPhoto, label: 'Vidjetlar', path: '/widgets' },
  { icon: IconBrandYoutube, label: 'Memlar' },
  { icon: IconChartBar, label: 'Stream statistikasi' },
  { icon: IconWallet, label: "Pul yig'ish" },
  { icon: IconSettings, label: 'Sozlamalar', path: '/donations/settings' },
  { icon: IconUserCircle, label: 'Profil', path: '/profile' },
]

export const SECONDARY_ITEMS: SidebarItem[] = [
  { icon: IconEdit, label: 'Admin Panel' },
]

export const LOGOUT_ITEM: SidebarItem = {
  icon: IconPower,
  label: 'Chiqish',
}
