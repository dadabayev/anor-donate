import { AdminLayout } from '../../layouts/admin-layout'
import { AdminRouteGuard } from '@features/admin-route-guard'
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const AdminDashboardPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminStubPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminStubPage })),
)

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminRouteGuard />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'bloggers', element: <AdminStubPage /> },
        { path: 'moderation', element: <AdminStubPage /> },
        { path: 'tts', element: <AdminStubPage /> },
        { path: 'meme-categories', element: <AdminStubPage /> },
        { path: 'memes', element: <AdminStubPage /> },
        { path: 'news', element: <AdminStubPage /> },
      ],
    },
  ],
}
