import { appRouter } from '../router/app-router'
import { ModalsProvider } from '@mantine/modals'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'

export const WithRouter = () => {
  const router = createBrowserRouter([
    {
      element: (
        <ModalsProvider>
          <Outlet />
        </ModalsProvider>
      ),
      children: appRouter,
    },
  ])
  return <RouterProvider router={router} />
}
