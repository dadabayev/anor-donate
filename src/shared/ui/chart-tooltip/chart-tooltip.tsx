import cn from './chart-tooltip.module.css'

import classNames from 'classnames'
import type { CSSProperties, ReactNode } from 'react'

export interface ChartTooltipItem {
  label: string
  value: string
  color: string
}

export interface ChartTooltipProps {
  title: ReactNode
  items: ChartTooltipItem[]
  visible: boolean
  left: number
  top: number
  align?: 'start' | 'center' | 'end'
  className?: string
}

export const ChartTooltip = ({
  title,
  items,
  visible,
  left,
  top,
  align = 'center',
  className,
}: Readonly<ChartTooltipProps>) => {
  const style = {
    left: `${left}%`,
    top: `${top}%`,
  } satisfies CSSProperties

  return (
    <div
      className={classNames(
        cn.tooltip,
        align === 'start'
          ? cn.alignStart
          : align === 'end'
            ? cn.alignEnd
            : cn.alignCenter,
        visible ? cn.tooltipVisible : cn.tooltipHidden,
        className,
      )}
      style={style}
      role="tooltip"
      aria-hidden={!visible}
    >
      <div className={cn.title}>{title}</div>
      <div className={cn.items}>
        {items.map((item) => (
          <div key={item.label} className={cn.item}>
            <span
              className={cn.swatch}
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className={cn.label}>{item.label}</span>
            <span className={cn.value}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
