import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const StreamStatisticsPage = lazy(() =>
  import('@pages/stream-statistics').then((m) => ({
    default: m.StreamStatisticsPage,
  })),
)

export const streamStatisticsRoutes: RouteObject = {
  path: '/stream-statistics',
  element: <StreamStatisticsPage />,
}
