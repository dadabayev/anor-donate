import cn from '../memes-shared.module.css'

import { IconX } from '@tabler/icons-react'
import classNames from 'classnames'

interface MemeCardProps {
  actionLabel: string
  imageUrl: string
  isReadyCard?: boolean
  isSelected?: boolean
  priceUzs: number
  showDelete?: boolean
  onAction?: () => void
  onDeleteClick?: () => void
}

const formatMemePriceLabel = (price: number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(price)
  return `${formatted.replace(/,/g, ' ')}UZS`
}

export const MemeCard = ({
  actionLabel,
  imageUrl,
  isReadyCard,
  isSelected,
  priceUzs,
  showDelete,
  onAction,
  onDeleteClick,
}: Readonly<MemeCardProps>) => (
  <article
    className={classNames(
      cn.memeCard,
      isReadyCard && cn.memeCardReady,
      isSelected && cn.memeCardSelected,
    )}
  >
    <img src={imageUrl} alt="" className={cn.memeImage} aria-hidden="true" />

    {showDelete ? (
      <button
        type="button"
        className={cn.deleteButton}
        aria-label="Memni o'chirish"
        onClick={(event) => {
          event.stopPropagation()
          onDeleteClick?.()
        }}
      >
        <IconX size={20} stroke={1.8} />
      </button>
    ) : null}

    <button type="button" className={cn.memeActionButton} onClick={onAction}>
      {isReadyCard ? actionLabel : formatMemePriceLabel(priceUzs)}
    </button>
  </article>
)
