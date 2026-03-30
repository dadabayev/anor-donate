import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const DonationsPage = lazy(() =>
  import('@pages/donations').then((m) => ({ default: m.DonationsPage })),
)

export const donationsRoutes: RouteObject = {
  path: '/donations',
  element: <DonationsPage />,
}
