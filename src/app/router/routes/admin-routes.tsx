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
const AdminTtsPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminTtsPage })),
)
const AdminMemeCategoriesPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminMemeCategoriesPage })),
)
const AdminMemesPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminMemesPage })),
)
const AdminNewsPage = lazy(() =>
  import('@pages/admin').then((m) => ({ default: m.AdminNewsPage })),
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
        { path: 'tts', element: <AdminTtsPage /> },
        { path: 'meme-categories', element: <AdminMemeCategoriesPage /> },
        { path: 'memes', element: <AdminMemesPage /> },
        { path: 'news', element: <AdminNewsPage /> },
      ],
    },
  ],
}
