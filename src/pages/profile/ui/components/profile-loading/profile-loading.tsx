import cn from './profile-loading.module.css'

import classNames from 'classnames'

export const ProfileLoading = ({ title }: { title: string }) => {
  return (
    <section className={cn.page} aria-busy="true">
      <div className={cn.column}>
        <header className={cn.header}>
          <h1 className={cn.title}>{title}</h1>
        </header>
        <div className={cn.card}>
          <div className={cn.skeleton}>
            <div className={cn.skeletonHeader} />
            <div className={cn.skeletonGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={cn.skeletonField} />
              ))}
            </div>
            <div className={cn.sectionSpacer} />
            <div className={cn.skeletonRows}>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={classNames(
                    cn.skeletonRow,
                    index === 4 && cn.skeletonRowFull,
                  )}
                />
              ))}
            </div>
            <div className={cn.skeletonButton} />
          </div>
        </div>
      </div>
    </section>
  )
}
