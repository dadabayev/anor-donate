import cn from './admin-layout.module.css'

import { AdminSidebar } from '@widgets/admin-sidebar'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

export const AdminLayout = () => {
  return (
    <div className={cn.shell}>
      <aside className={cn.sidebar}>
        <AdminSidebar />
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
