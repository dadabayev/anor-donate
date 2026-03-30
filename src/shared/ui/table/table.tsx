import cn from './table.module.css'

import { Table as MantineTable } from '@mantine/core'
import classNames from 'classnames'
import type { ReactNode } from 'react'

export type TableAlign = 'left' | 'center' | 'right'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  render: (row: T, index: number) => ReactNode
  align?: TableAlign
  width?: string | number
  headerClassName?: string
  cellClassName?: string
}

export interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey: (row: T, index: number) => string
  className?: string
  caption?: ReactNode
  emptyState?: ReactNode
  variant?: 'default' | 'history'
}

const getAlignClass = (align: TableAlign | undefined) => {
  switch (align) {
    case 'center':
      return cn.center
    case 'right':
      return cn.right
    default:
      return cn.left
  }
}

export const Table = <T,>({
  columns,
  rows,
  getRowKey,
  className,
  caption,
  emptyState,
  variant = 'default',
}: TableProps<T>) => {
  return (
    <div
      className={classNames(
        cn.container,
        variant === 'history' && cn.containerHistory,
        className,
      )}
    >
      {caption ? <div className={cn.caption}>{caption}</div> : null}

      <div className={cn.scrollArea}>
        <MantineTable
          className={classNames(
            cn.table,
            variant === 'history' && cn.tableHistory,
          )}
          layout="fixed"
          withTableBorder={false}
          withColumnBorders={false}
          withRowBorders={variant === 'history'}
          highlightOnHover={variant !== 'history'}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <MantineTable.Th
                  key={column.key}
                  className={classNames(
                    getAlignClass(column.align),
                    variant === 'history' && cn.headCellHistory,
                    column.headerClassName,
                  )}
                  style={
                    column.width
                      ? {
                          width:
                            typeof column.width === 'number'
                              ? `${column.width}px`
                              : column.width,
                        }
                      : undefined
                  }
                >
                  {column.header}
                </MantineTable.Th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={getRowKey(row, rowIndex)}>
                  {columns.map((column) => (
                    <MantineTable.Td
                      key={column.key}
                      className={classNames(
                        getAlignClass(column.align),
                        variant === 'history' && cn.bodyCellHistory,
                        column.cellClassName,
                      )}
                    >
                      {column.render(row, rowIndex)}
                    </MantineTable.Td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <MantineTable.Td
                  className={cn.emptyCell}
                  colSpan={columns.length}
                >
                  {emptyState ?? "Ma'lumot topilmadi"}
                </MantineTable.Td>
              </tr>
            )}
          </tbody>
        </MantineTable>
      </div>
    </div>
  )
}
