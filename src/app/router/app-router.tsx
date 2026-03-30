import { MainLayout } from '../layouts/main-layout'
import { donationSettingsRoutes } from './routes/donation-settings-routes'
import { donationsRoutes } from './routes/donations-routes'
import { homeRoutes } from './routes/home-routes'
import { notificationPanelRoutes } from './routes/notification-panel-routes'
import { profileRoutes } from './routes/profile-routes'
import { widgetsRoutes } from './routes/widgets-routes'
import { Navigate, type RouteObject } from 'react-router-dom'

export const appRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/dashboard'} replace />,
  },
  {
    element: <MainLayout />,
    children: [
      homeRoutes,
      donationsRoutes,
      donationSettingsRoutes,
      notificationPanelRoutes,
      profileRoutes,
      ...widgetsRoutes,
    ],
  },
  {
    path: '*',
    element: <Navigate to={'/dashboard'} replace />,
  },
]
