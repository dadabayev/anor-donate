import cn from './meme-item-modals.module.css'

import type { AdminMemeRow } from '../model/admin-memes'
import { Modal } from '@shared/ui'
import classNames from 'classnames'

export interface ViewMemeModalLabels {
  title: string
  close: string
  dismiss: string
  categoryCaption: string
  nameCaption: string
  durationCaption: string
  statusCaption: string
  active: string
  inactive: string
}

interface ViewMemeModalProps {
  meme: AdminMemeRow | null
  isOpen: boolean
  labels: ViewMemeModalLabels
  onClose: () => void
}

export const ViewMemeModal = ({
  meme,
  isOpen,
  labels,
  onClose,
}: Readonly<ViewMemeModalProps>) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      closeAriaLabel={labels.close}
      width="lg"
      footer={
        <div className={cn.footer}>
          <button
            type="button"
            className={cn.secondaryButton}
            onClick={onClose}
          >
            {labels.dismiss}
          </button>
        </div>
      }
    >
      {meme ? (
        <div className={cn.viewGrid}>
          <img
            className={cn.thumb}
            src={meme.videoThumbUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.categoryCaption}</span>
            <span className={cn.viewValue}>{meme.categoryName}</span>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.nameCaption}</span>
            <span className={cn.viewValue}>{meme.name}</span>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.durationCaption}</span>
            <span className={cn.viewValue}>{meme.duration}</span>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.statusCaption}</span>
            <span
              className={classNames(
                cn.viewValue,
                meme.status === 'active' ? cn.statusActive : cn.statusInactive,
              )}
            >
              {meme.status === 'active' ? labels.active : labels.inactive}
            </span>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
