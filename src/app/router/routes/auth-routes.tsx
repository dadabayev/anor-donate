import { GuestRouteGuard } from '@features/guest-access'
import type { ComponentType, LazyExoticComponent } from 'react'
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

const SignInPage = lazy(() =>
  import('@pages/auth').then((module) => ({ default: module.SignInPage })),
)

const SignUpPage = lazy(() =>
  import('@pages/auth').then((module) => ({ default: module.SignUpPage })),
)

const ResetPasswordPage = lazy(() =>
  import('@pages/auth').then((module) => ({
    default: module.ResetPasswordPage,
  })),
)

const OtpSmsPage = lazy(() =>
  import('@pages/auth').then((module) => ({ default: module.OtpSmsPage })),
)

const withSuspense = (Component: LazyExoticComponent<ComponentType>) => {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  )
}

export const authRoutes: RouteObject[] = [
  {
    element: <GuestRouteGuard />,
    children: [
      {
        path: '/sign-in',
        element: withSuspense(SignInPage),
      },
      {
        path: '/sign-up',
        element: withSuspense(SignUpPage),
      },
      {
        path: '/reset-password',
        element: withSuspense(ResetPasswordPage),
      },
      {
        path: '/otp-sms',
        element: withSuspense(OtpSmsPage),
      },
    ],
  },
]
