import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const FundraisingPage = lazy(() =>
  import('@pages/fundraising').then((m) => ({ default: m.FundraisingPage })),
)

export const fundraisingRoutes: RouteObject = {
  path: '/fundraising',
  element: <FundraisingPage />,
}
