import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const ProfilePage = lazy(() =>
  import('@pages/profile').then((m) => ({ default: m.ProfilePage })),
)

export const profileRoutes: RouteObject = {
  path: '/profile',
  element: <ProfilePage />,
}
