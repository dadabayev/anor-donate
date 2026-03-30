import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const NotificationPanelPage = lazy(() =>
  import('@pages/notification-panel').then((m) => ({
    default: m.NotificationPanelPage,
  })),
)

export const notificationPanelRoutes: RouteObject = {
  path: '/notification-panel',
  element: <NotificationPanelPage />,
}
