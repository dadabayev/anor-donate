import cn from './pagination-stepper.module.css'

import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react'
import classNames from 'classnames'

const DEFAULT_PAGE_LABELS = ['1', '2', '3', '4', '...', '33'] as const

interface PaginationStepperProps {
  activePageLabel?: string
  ariaLabel?: string
  pageLabels?: readonly string[]
}

export const PaginationStepper = ({
  activePageLabel = '1',
  ariaLabel = 'Pagination',
  pageLabels = DEFAULT_PAGE_LABELS,
}: Readonly<PaginationStepperProps>) => (
  <nav className={cn.root} aria-label={ariaLabel}>
    <button type="button" className={classNames(cn.pageDot, cn.pageDotArrow)}>
      <IconArrowNarrowLeft size={14} />
    </button>
    {pageLabels.map((page, index) => (
      <button
        key={`${page}-${index}`}
        type="button"
        className={classNames(
          cn.pageDot,
          page === activePageLabel && cn.pageDotActive,
        )}
      >
        {page}
      </button>
    ))}
    <button type="button" className={classNames(cn.pageDot, cn.pageDotArrow)}>
      <IconArrowNarrowRight size={14} />
    </button>
  </nav>
)
