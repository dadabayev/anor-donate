import cn from '../stream-statistics-page.module.css'

import classNames from 'classnames'

interface StreamStatisticsLoadingProps {
  title: string
}

export const StreamStatisticsLoading = ({
  title,
}: Readonly<StreamStatisticsLoadingProps>) => {
  return (
    <section className={cn.page} aria-busy="true" aria-label={title}>
      <div className={cn.column}>
        <header className={cn.header}>
          <h1 className={cn.title}>{title}</h1>
          <div
            className={classNames(cn.skeletonLine, cn.skeletonSubtitle)}
            aria-hidden
          />
        </header>

        <div className={classNames(cn.skeletonCard)}>
          <div className={classNames(cn.skeletonLine, cn.skeletonRow)} />
          <div className={classNames(cn.skeletonLine, cn.skeletonRow)} />
          <div className={cn.skeletonGrid}>
            <div className={classNames(cn.skeletonLine, cn.skeletonSelect)} />
            <div className={classNames(cn.skeletonLine, cn.skeletonSelect)} />
          </div>
          <div className={classNames(cn.skeletonLine, cn.skeletonSlider)} />
          <div className={classNames(cn.skeletonLine, cn.skeletonButton)} />
        </div>

        <div className={classNames(cn.skeletonLine, cn.skeletonCollapsed)} />
        <div className={classNames(cn.skeletonLine, cn.skeletonCollapsed)} />
      </div>
    </section>
  )
}
