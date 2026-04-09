import cn from '../fundraising-page.module.css'

import classNames from 'classnames'

interface FundraisingLoadingProps {
  title: string
}

export const FundraisingLoading = ({
  title,
}: Readonly<FundraisingLoadingProps>) => {
  return (
    <section className={cn.page} aria-busy="true" aria-label={title}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <div className={classNames(cn.skeletonLine, cn.skeletonTitle)} />
          <div className={classNames(cn.skeletonLine, cn.skeletonSubtitle)} />
        </header>

        <div className={cn.stack}>
          <div className={classNames(cn.skeletonLine, cn.skeletonCard)} />
          <div
            className={classNames(
              cn.skeletonLine,
              cn.skeletonCard,
              cn.skeletonCardTall,
            )}
          />
          <div
            className={classNames(
              cn.skeletonLine,
              cn.skeletonCard,
              cn.skeletonCardAnim,
            )}
          />
          <div className={classNames(cn.skeletonLine, cn.skeletonButton)} />
        </div>
      </div>
    </section>
  )
}
