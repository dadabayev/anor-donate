import cn from './calendar.module.css'

import { Calendar } from './calendar'
import { render } from '@shared/lib'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Calendar', () => {
  it('renders localized month heading and navigation controls', () => {
    render(
      <Calendar mode="range" locale="ru" defaultValue={new Date(2023, 7, 1)} />,
    )

    expect(
      screen.getByText(/\u0430\u0432\u0433\u0443\u0441\u0442 2023/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Previous month' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next month' }),
    ).toBeInTheDocument()
  })

  it('marks range boundaries and middle dates with the expected classes', () => {
    render(
      <Calendar
        mode="range"
        locale="ru"
        defaultValue={new Date(2023, 7, 1)}
        rangeValue={{
          start: new Date(2023, 7, 9),
          end: new Date(2023, 7, 14),
        }}
      />,
    )

    const startDay = screen.getByRole('button', { name: '2023-08-09' })
    const middleDay = screen.getByRole('button', { name: '2023-08-11' })
    const endDay = screen.getByRole('button', { name: '2023-08-14' })

    expect(startDay).toHaveClass(cn.day)
    expect(startDay).toHaveAttribute('data-selected')
    expect(startDay).toHaveAttribute('data-first-in-range')

    expect(middleDay).toHaveClass(cn.day)
    expect(middleDay).toHaveAttribute('data-in-range')

    expect(endDay).toHaveClass(cn.day)
    expect(endDay).toHaveAttribute('data-selected')
    expect(endDay).toHaveAttribute('data-last-in-range')
  })
})
