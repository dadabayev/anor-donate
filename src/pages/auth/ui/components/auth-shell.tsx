import cn from '../auth-page.module.css'

import { AuthBrand } from './auth-brand'
import classNames from 'classnames'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface AuthShellProps {
  title: string
  children: ReactNode
  align?: 'center' | 'top'
  variant?: 'signIn' | 'signUp' | 'resetPassword' | 'otp'
}

const pageVariantClassNames = {
  signIn: cn.signInPage,
  signUp: cn.signUpPage,
  resetPassword: cn.resetPasswordPage,
  otp: cn.otpPage,
} as const

export const AuthShell = ({
  title,
  children,
  align = 'center',
  variant,
}: Readonly<AuthShellProps>) => {
  const { t } = useTranslation()

  return (
    <div
      className={classNames(cn.page, variant && pageVariantClassNames[variant])}
    >
      <div className={cn.layout}>
        <section
          className={classNames(
            cn.panel,
            align === 'top' ? cn.panelTop : cn.panelCenter,
          )}
        >
          <div className={cn.panelInner}>
            <AuthBrand />
            <div className={cn.section}>
              <h1 className={cn.title}>{title}</h1>
              {children}
            </div>
          </div>
        </section>

        <aside className={cn.visual} aria-hidden="true">
          <p className={cn.visualLabel}>
            {t('auth.shell.streamerPhotoCaption')}
          </p>
        </aside>
      </div>
    </div>
  )
}
