import cn from './main-layout.module.css'

import { Sidebar } from '@widgets/sidebar'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className={cn.shell}>
      <aside className={cn.sidebar}>
        <Sidebar />
      </aside>
      <div className={cn.content}>
        <ErrorBoundary fallback={'Error...'}>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
