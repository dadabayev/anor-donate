import cn from '../meme-editor-page.module.css'
import shared from '../memes-shared.module.css'

import type { MemeItem } from '../../model/memes'
import { MemeCard } from './meme-card'
import { Loader, PaginationStepper } from '@shared/ui'

interface ReadyMemesTabProps {
  error: string | null
  isLoading: boolean
  memes: MemeItem[]
  onSelect: (meme: MemeItem) => void
}

export const ReadyMemesTab = ({
  error,
  isLoading,
  memes,
  onSelect,
}: Readonly<ReadyMemesTabProps>) => {
  if (isLoading) {
    return (
      <section className={cn.tabCard}>
        <div className={cn.centerState}>
          <Loader />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={cn.tabCard}>
        <div className={cn.centerState}>
          <p className={cn.errorText}>{error}</p>
        </div>
      </section>
    )
  }

  if (memes.length === 0) {
    return (
      <section className={cn.tabCard}>
        <div className={cn.centerState}>
          <p className={cn.emptyText}>Tayyor memlar topilmadi</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn.tabCard}>
      <h2 className={cn.sectionTitle}>Mening Memlar</h2>
      <div className={shared.memeGrid}>
        {memes.map((meme) => (
          <MemeCard
            key={meme.id}
            imageUrl={meme.imageUrl}
            priceUzs={meme.priceUzs}
            isReadyCard
            actionLabel="Qo'shish"
            onAction={() => onSelect(meme)}
          />
        ))}
      </div>
      <div className={cn.tabCardFooter}>
        <PaginationStepper />
      </div>
    </section>
  )
}
