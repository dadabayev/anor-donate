import cn from './meme-category-modals.module.css'

import type { AdminMemeCategoryRow } from '../model/admin-meme-categories'
import { Modal } from '@shared/ui'

export interface ViewMemeCategoryModalLabels {
  title: string
  close: string
  nameCaption: string
  dateCaption: string
  dismiss: string
}

interface ViewMemeCategoryModalProps {
  category: AdminMemeCategoryRow | null
  isOpen: boolean
  labels: ViewMemeCategoryModalLabels
  onClose: () => void
}

export const ViewMemeCategoryModal = ({
  category,
  isOpen,
  labels,
  onClose,
}: Readonly<ViewMemeCategoryModalProps>) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      closeAriaLabel={labels.close}
      width="md"
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
      {category ? (
        <div className={cn.viewGrid}>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.nameCaption}</span>
            <span className={cn.viewValue}>{category.name}</span>
          </div>
          <div className={cn.viewRow}>
            <span className={cn.viewCaption}>{labels.dateCaption}</span>
            <span className={cn.viewValue}>{category.createdAt}</span>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
