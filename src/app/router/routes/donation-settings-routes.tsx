import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const DonationSettingsPage = lazy(() =>
  import('@pages/donation-settings').then((m) => ({
    default: m.DonationSettingsPage,
  })),
)

export const donationSettingsRoutes: RouteObject = {
  path: '/donations/settings',
  element: <DonationSettingsPage />,
}
