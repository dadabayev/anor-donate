import { MainLayout } from '../layouts/main-layout'
import { authRoutes } from './routes/auth-routes'
import { donationSettingsRoutes } from './routes/donation-settings-routes'
import { donationsRoutes } from './routes/donations-routes'
import { fundraisingRoutes } from './routes/fundraising-routes'
import { homeRoutes } from './routes/home-routes'
import { memesRoutes } from './routes/memes-routes'
import { notificationPanelRoutes } from './routes/notification-panel-routes'
import { profileRoutes } from './routes/profile-routes'
import { streamStatisticsRoutes } from './routes/stream-statistics-routes'
import { widgetsRoutes } from './routes/widgets-routes'
import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const LandingPage = lazy(() =>
  import('@pages/landing').then((m) => ({ default: m.LandingPage })),
)

export const appRouter: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <LandingPage />
      </Suspense>
    ),
  },
  ...authRoutes,
  {
    element: <MainLayout />,
    children: [
      homeRoutes,
      donationsRoutes,
      donationSettingsRoutes,
      notificationPanelRoutes,
      profileRoutes,
      streamStatisticsRoutes,
      fundraisingRoutes,
      {
        path: '/pul-yigish',
        element: <Navigate to="/fundraising" replace />,
      },
      ...memesRoutes,
      ...widgetsRoutes,
    ],
  },
  {
    path: '*',
    element: <Navigate to={'/dashboard'} replace />,
  },
]
