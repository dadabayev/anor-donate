import cn from './profile-loading.module.css'

import { Skeleton } from '@mantine/core'
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
            <Skeleton height={104} radius={16} />
            <div className={cn.skeletonGrid}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} height={79} radius={16} />
              ))}
            </div>
            <div className={cn.sectionSpacer} />
            <div className={cn.skeletonRows}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height={48}
                  radius={16}
                  className={classNames(index === 4 && cn.skeletonRowFull)}
                />
              ))}
            </div>
            <Skeleton
              height={48}
              width={265}
              radius={16}
              className={cn.skeletonButton}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
