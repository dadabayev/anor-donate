import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const WidgetsPage = lazy(() =>
  import('@pages/widgets').then((m) => ({ default: m.WidgetsPage })),
)
const WidgetEditorPage = lazy(() =>
  import('@pages/widgets').then((m) => ({ default: m.WidgetEditorPage })),
)

export const widgetsRoutes: RouteObject[] = [
  {
    path: '/widgets',
    element: <WidgetsPage />,
  },
  {
    path: '/widgets/create',
    element: <WidgetEditorPage />,
  },
  {
    path: '/widgets/:widgetId/edit',
    element: <WidgetEditorPage />,
  },
]
