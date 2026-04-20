import cn from './moderation-row-actions.module.css'

import { IconCheck, IconEye, IconX } from '@tabler/icons-react'
import classNames from 'classnames'

export interface ModerationRowActionsProps {
  viewLabel: string
  approveLabel: string
  rejectLabel: string
  onView: () => void
  onApprove: () => void
  onReject: () => void
  className?: string
}

export const ModerationRowActions = ({
  viewLabel,
  approveLabel,
  rejectLabel,
  onView,
  onApprove,
  onReject,
  className,
}: Readonly<ModerationRowActionsProps>) => {
  return (
    <div className={classNames(cn.row, className)} role="group">
      <button
        type="button"
        className={classNames(cn.btn, cn.success)}
        aria-label={approveLabel}
        onClick={onApprove}
      >
        <IconCheck size={18} stroke={2} />
      </button>
      <button
        type="button"
        className={classNames(cn.btn, cn.danger)}
        aria-label={rejectLabel}
        onClick={onReject}
      >
        <IconX size={18} stroke={2} />
      </button>
      <button
        type="button"
        className={classNames(cn.btn, cn.muted)}
        aria-label={viewLabel}
        onClick={onView}
      >
        <IconEye size={18} stroke={2} />
      </button>
    </div>
  )
}
