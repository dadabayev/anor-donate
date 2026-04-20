import cn from '../admin-bloggers-page.module.css'

import classNames from 'classnames'

export const AdminBloggersLoading = ({ title }: { title: string }) => {
  return (
    <section className={cn.page} aria-busy="true">
      <header className={cn.headerBlock}>
        <h1 className={cn.title}>{title}</h1>
      </header>

      <div className={cn.loadingCard}>
        <div className={cn.loadingHeader} />
        <div className={cn.loadingBody}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={classNames(
                cn.loadingRow,
                index === 0 && cn.loadingRowWide,
                index === 4 && cn.loadingRowWide,
              )}
            />
          ))}
        </div>
      </div>

      <div className={cn.loadingPagination}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={classNames(
              cn.loadingPaginationDot,
              index === 0 && cn.loadingPaginationDotFilled,
            )}
          />
        ))}
      </div>
    </section>
  )
}
