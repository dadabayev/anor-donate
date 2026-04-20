import { AdminLayout } from '../../layouts/admin-layout'
import { AdminRouteGuard } from '@features/admin-route-guard'
import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const AdminDashboardPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminBloggersPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminBloggersPage })),
)
const AdminModerationPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminModerationPage })),
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
        { path: 'customers', element: <AdminBloggersPage /> },
        {
          path: 'bloggers',
          element: <Navigate to="/admin/customers" replace />,
        },
        { path: 'moderation', element: <AdminModerationPage /> },
        { path: 'tts', element: <AdminStubPage /> },
        { path: 'meme-categories', element: <AdminStubPage /> },
        { path: 'memes', element: <AdminStubPage /> },
        { path: 'news', element: <AdminStubPage /> },
      ],
    },
  ],
}
