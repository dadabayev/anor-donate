import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const MemesPage = lazy(() =>
  import('@pages/memes').then((m) => ({ default: m.MemesPage })),
)
const MemeEditorPage = lazy(() =>
  import('@pages/memes').then((m) => ({ default: m.MemeEditorPage })),
)

export const memesRoutes: RouteObject[] = [
  {
    path: '/memes',
    element: <MemesPage />,
  },
  {
    path: '/memes/create',
    element: <MemeEditorPage />,
  },
  {
    path: '/memes/:memeId/edit',
    element: <MemeEditorPage />,
  },
]
