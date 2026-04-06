import cn from '../auth-page.module.css'

import { AuthBrand } from './auth-brand'
import classNames from 'classnames'
import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  children: ReactNode
  align?: 'center' | 'top'
}

export const AuthShell = ({
  title,
  children,
  align = 'center',
}: Readonly<AuthShellProps>) => {
  return (
    <div className={cn.page}>
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
          <p className={cn.visualLabel}>фото стримера</p>
        </aside>
      </div>
    </div>
  )
}
