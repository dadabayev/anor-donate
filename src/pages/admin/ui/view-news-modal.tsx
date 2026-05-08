import cn from './news-modals.module.css'

import type { AdminNewsRow } from '../model/admin-news'
import { newsCoverSrc } from '../model/admin-news'
import { Modal } from '@shared/ui'
import classNames from 'classnames'

export interface ViewNewsModalLabels {
  title: string
  close: string
  dismiss: string
  headlineCaption: string
  bodyCaption: string
  statusCaption: string
  published: string
  draft: string
}

interface ViewNewsModalProps {
  news: AdminNewsRow | null
  isOpen: boolean
  labels: ViewNewsModalLabels
  onClose: () => void
}

export const ViewNewsModal = ({
  news,
  isOpen,
  labels,
  onClose,
}: Readonly<ViewNewsModalProps>) => {
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
      {news ? (
        <div className={cn.viewGrid}>
          <img
            className={cn.thumb}
            src={newsCoverSrc(news)}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.headlineCaption}</span>
            <span className={cn.viewValue}>{news.title}</span>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.bodyCaption}</span>
            <div className={classNames(cn.viewValue, cn.bodyScroll)}>
              {news.body}
            </div>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.statusCaption}</span>
            <span
              className={classNames(
                cn.viewValue,
                news.status === 'published'
                  ? cn.statusPublished
                  : cn.statusDraft,
              )}
            >
              {news.status === 'published' ? labels.published : labels.draft}
            </span>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
