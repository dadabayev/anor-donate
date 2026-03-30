import { MainLayout } from '../layouts/main-layout'
import { donationSettingsRoutes } from './routes/donation-settings-routes'
import { donationsRoutes } from './routes/donations-routes'
import { homeRoutes } from './routes/home-routes'
import { notificationPanelRoutes } from './routes/notification-panel-routes'
import { profileRoutes } from './routes/profile-routes'
import { Navigate, type RouteObject } from 'react-router-dom'

export const appRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/dashboard'} replace />,
  },
  {
    path: '/donatlar',
    element: <Navigate to={'/donations'} replace />,
  },
  {
    path: '/donatlar/sozlamalar',
    element: <Navigate to={'/donations/settings'} replace />,
  },
  {
    path: '/donatlar/profil',
    element: <Navigate to={'/profile'} replace />,
  },
  {
    path: '/donations/profile',
    element: <Navigate to={'/profile'} replace />,
  },
  {
    element: <MainLayout />,
    children: [
      homeRoutes,
      donationsRoutes,
      donationSettingsRoutes,
      notificationPanelRoutes,
      profileRoutes,
    ],
  },
  {
    path: '*',
    element: <Navigate to={'/dashboard'} replace />,
  },
]
