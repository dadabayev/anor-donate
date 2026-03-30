import cn from '../widgets-page.module.css'

import classNames from 'classnames'

export const WidgetsLoading = ({ title }: { title: string }) => {
  return (
    <section className={cn.page} aria-busy="true">
      <div className={cn.column}>
        <header className={cn.hero}>
          <div className={cn.heroText}>
            <h1 className={cn.title}>{title}</h1>
            <div className={classNames(cn.skeletonLine, cn.skeletonSubtitle)} />
          </div>
          <div
            className={classNames(cn.skeletonButton, cn.heroButtonSkeleton)}
          />
        </header>

        <section className={classNames(cn.linkCard, cn.skeletonCard)}>
          <div className={classNames(cn.skeletonLine, cn.skeletonTitle)} />
          <div className={cn.skeletonLinkRow}>
            <div className={classNames(cn.skeletonLine, cn.skeletonInput)} />
            <div className={classNames(cn.skeletonButton, cn.skeletonSquare)} />
          </div>
        </section>

        <section className={classNames(cn.widgetCard, cn.skeletonCard)}>
          <div
            className={classNames(cn.skeletonLine, cn.skeletonWidgetTitle)}
          />
          <div className={cn.skeletonWidgetGrid}>
            <div className={cn.skeletonPreview} />
            <div className={cn.skeletonContent}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className={classNames(
                    cn.skeletonLine,
                    index < 4 ? cn.skeletonMetric : cn.skeletonSwatch,
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {Array.from({ length: 3 }).map((_, index) => (
          <section
            key={index}
            className={classNames(cn.widgetCard, cn.widgetCardCollapsed)}
          >
            <div
              className={classNames(cn.skeletonLine, cn.skeletonCollapsedTitle)}
            />
          </section>
        ))}
      </div>
    </section>
  )
}
