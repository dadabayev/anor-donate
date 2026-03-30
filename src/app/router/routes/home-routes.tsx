import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const HomePage = lazy(() =>
  import('@pages/home').then((m) => ({ default: m.HomePage })),
)

export const homeRoutes: RouteObject = {
  path: '/dashboard',
  element: <HomePage />,
}
