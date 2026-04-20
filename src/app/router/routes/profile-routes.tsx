import { lazy } from 'react'
import { Outlet, type RouteObject } from 'react-router-dom'

const ProfilePage = lazy(() =>
  import('@pages/profile').then((m) => ({ default: m.ProfilePage })),
)
const ProfileEditPage = lazy(() =>
  import('@pages/profile').then((m) => ({ default: m.ProfileEditPage })),
)

export const profileRoutes: RouteObject = {
  path: 'profile',
  element: <Outlet />,
  children: [
    { index: true, element: <ProfilePage /> },
    { path: 'edit', element: <ProfileEditPage /> },
  ],
}
