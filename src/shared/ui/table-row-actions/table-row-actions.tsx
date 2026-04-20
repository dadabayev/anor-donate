import cn from './table-row-actions.module.css'

import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react'
import classNames from 'classnames'

export interface TableRowActionsProps {
  editLabel: string
  viewLabel: string
  deleteLabel: string
  onEdit: () => void
  onView: () => void
  onDelete: () => void
  className?: string
}

export const TableRowActions = ({
  editLabel,
  viewLabel,
  deleteLabel,
  onEdit,
  onView,
  onDelete,
  className,
}: Readonly<TableRowActionsProps>) => {
  return (
    <div className={classNames(cn.row, className)} role="group">
      <button
        type="button"
        className={classNames(cn.btn, cn.primary)}
        aria-label={editLabel}
        onClick={onEdit}
      >
        <IconPencil size={18} stroke={2} />
      </button>
      <button
        type="button"
        className={classNames(cn.btn, cn.muted)}
        aria-label={viewLabel}
        onClick={onView}
      >
        <IconEye size={18} stroke={2} />
      </button>
      <button
        type="button"
        className={classNames(cn.btn, cn.danger)}
        aria-label={deleteLabel}
        onClick={onDelete}
      >
        <IconTrash size={18} stroke={2} />
      </button>
    </div>
  )
}
