import 'dayjs/locale/ru'

import cn from './calendar.module.css'

import { Paper } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

type CalendarMode = 'single' | 'range'

interface IDateRange {
  start: Date | null
  end: Date | null
}

interface ICalendarProps {
  mode?: CalendarMode
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date) => void
  rangeValue?: IDateRange
  defaultRangeValue?: IDateRange
  onRangeChange?: (range: IDateRange) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  hideOutsideDays?: boolean
}

type TMantineRangeValue = [string | null, string | null]

const toDateString = (date: Date | null | undefined) =>
  date ? dayjs(date).format('YYYY-MM-DD') : null

const toDate = (date: string | null) =>
  date ? dayjs(date, 'YYYY-MM-DD').toDate() : null

const getInitialDisplayDate = ({
  mode,
  value,
  defaultValue,
  rangeValue,
  defaultRangeValue,
}: Pick<
  ICalendarProps,
  'mode' | 'value' | 'defaultValue' | 'rangeValue' | 'defaultRangeValue'
>) =>
  toDateString(
    mode === 'range'
      ? (rangeValue?.start ??
          rangeValue?.end ??
          defaultRangeValue?.start ??
          defaultRangeValue?.end ??
          defaultValue ??
          new Date())
      : (value ?? defaultValue ?? new Date()),
  ) ?? dayjs().format('YYYY-MM-DD')

export const Calendar = ({
  mode = 'single',
  value,
  defaultValue = null,
  onChange,
  rangeValue,
  defaultRangeValue = { start: null, end: null },
  onRangeChange,
  minDate,
  maxDate,
  className,
  locale = 'ru',
  weekStartsOn = 1,
  hideOutsideDays = true,
}: Readonly<ICalendarProps>) => {
  const isControlled = value !== undefined
  const isRangeControlled = rangeValue !== undefined

  const [internalDate, setInternalDate] = useState<Date | null>(defaultValue)
  const [internalRange, setInternalRange] =
    useState<IDateRange>(defaultRangeValue)

  const selectedDate = isControlled ? (value ?? null) : internalDate
  const selectedRange = isRangeControlled
    ? (rangeValue ?? internalRange)
    : internalRange

  const selectionSignature = useMemo(
    () =>
      mode === 'range'
        ? `${toDateString(selectedRange?.start)}|${toDateString(selectedRange?.end)}`
        : `${toDateString(selectedDate)}`,
    [mode, selectedDate, selectedRange?.end, selectedRange?.start],
  )

  const derivedDisplayDate = useMemo(
    () =>
      getInitialDisplayDate({
        mode,
        value: selectedDate,
        defaultValue,
        rangeValue: selectedRange,
        defaultRangeValue,
      }),
    [defaultRangeValue, defaultValue, mode, selectedDate, selectedRange],
  )

  const [navigatedMonth, setNavigatedMonth] = useState<{
    sig: string
    month: string
  } | null>(null)

  const displayDate =
    navigatedMonth && navigatedMonth.sig === selectionSignature
      ? navigatedMonth.month
      : derivedDisplayDate

  const handleDateChange = (next: string) => {
    setNavigatedMonth({ sig: selectionSignature, month: next })
  }

  const singleValue = useMemo(() => toDateString(selectedDate), [selectedDate])
  const rangePickerValue = useMemo<TMantineRangeValue>(
    () => [
      toDateString(selectedRange?.start ?? null),
      toDateString(selectedRange?.end ?? null),
    ],
    [selectedRange?.end, selectedRange?.start],
  )

  const handleSingleChange = (nextValue: string | null) => {
    const nextDate = toDate(nextValue)

    if (!nextDate) {
      return
    }

    if (!isControlled) {
      setInternalDate(nextDate)
    }

    onChange?.(nextDate)
  }

  const handleRangeChange = (nextValue: TMantineRangeValue) => {
    const nextRange = {
      start: toDate(nextValue[0]),
      end: toDate(nextValue[1]),
    }

    if (!isRangeControlled) {
      setInternalRange(nextRange)
    }

    onRangeChange?.(nextRange)
  }

  return (
    <Paper className={classNames(cn.container, className)}>
      {mode === 'range' ? (
        <DatePicker
          type="range"
          value={rangePickerValue}
          onChange={handleRangeChange}
          date={displayDate}
          onDateChange={handleDateChange}
          locale={locale}
          firstDayOfWeek={weekStartsOn}
          hideOutsideDates={hideOutsideDays}
          minDate={toDateString(minDate) ?? undefined}
          maxDate={toDateString(maxDate) ?? undefined}
          allowSingleDateInRange
          monthLabelFormat="MMMM YYYY"
          monthsListFormat="MMMM"
          yearsListFormat="YYYY"
          maxLevel="decade"
          headerControlsOrder={['level', 'previous', 'next']}
          withCellSpacing={false}
          previousIcon={<IconChevronLeft size={18} stroke={1.7} />}
          nextIcon={<IconChevronRight size={18} stroke={1.7} />}
          getDayAriaLabel={(date) => dayjs(date).format('YYYY-MM-DD')}
          ariaLabels={{
            monthLevelControl: 'Change month and year',
            yearLevelControl: 'Change year',
            previousMonth: 'Previous month',
            nextMonth: 'Next month',
            previousYear: 'Previous year',
            nextYear: 'Next year',
            previousDecade: 'Previous decade',
            nextDecade: 'Next decade',
          }}
          classNames={{
            calendarHeader: cn.header,
            calendarHeaderLevel: cn.monthSelect,
            calendarHeaderControl: cn.navAction,
            calendarHeaderControlIcon: cn.navIcon,
            levelsGroup: cn.levelsGroup,
            month: cn.month,
            monthCell: cn.monthCell,
            monthRow: cn.monthRow,
            weekdaysRow: cn.weekdaysRow,
            weekday: cn.weekdayLabel,
            day: cn.day,
            monthsList: cn.monthsList,
            monthsListCell: cn.pickerCell,
            monthsListRow: cn.pickerRow,
            monthsListControl: cn.pickerControl,
            yearsList: cn.yearsList,
            yearsListCell: cn.pickerCell,
            yearsListRow: cn.pickerRow,
            yearsListControl: cn.pickerControl,
          }}
        />
      ) : (
        <DatePicker
          type="default"
          value={singleValue}
          onChange={handleSingleChange}
          date={displayDate}
          onDateChange={handleDateChange}
          locale={locale}
          firstDayOfWeek={weekStartsOn}
          hideOutsideDates={hideOutsideDays}
          minDate={toDateString(minDate) ?? undefined}
          maxDate={toDateString(maxDate) ?? undefined}
          monthLabelFormat="MMMM YYYY"
          monthsListFormat="MMMM"
          yearsListFormat="YYYY"
          maxLevel="decade"
          headerControlsOrder={['level', 'previous', 'next']}
          withCellSpacing={false}
          previousIcon={<IconChevronLeft size={18} stroke={1.7} />}
          nextIcon={<IconChevronRight size={18} stroke={1.7} />}
          getDayAriaLabel={(date) => dayjs(date).format('YYYY-MM-DD')}
          ariaLabels={{
            monthLevelControl: 'Change month and year',
            yearLevelControl: 'Change year',
            previousMonth: 'Previous month',
            nextMonth: 'Next month',
            previousYear: 'Previous year',
            nextYear: 'Next year',
            previousDecade: 'Previous decade',
            nextDecade: 'Next decade',
          }}
          classNames={{
            calendarHeader: cn.header,
            calendarHeaderLevel: cn.monthSelect,
            calendarHeaderControl: cn.navAction,
            calendarHeaderControlIcon: cn.navIcon,
            levelsGroup: cn.levelsGroup,
            month: cn.month,
            monthCell: cn.monthCell,
            monthRow: cn.monthRow,
            weekdaysRow: cn.weekdaysRow,
            weekday: cn.weekdayLabel,
            day: cn.day,
            monthsList: cn.monthsList,
            monthsListCell: cn.pickerCell,
            monthsListRow: cn.pickerRow,
            monthsListControl: cn.pickerControl,
            yearsList: cn.yearsList,
            yearsListCell: cn.pickerCell,
            yearsListRow: cn.pickerRow,
            yearsListControl: cn.pickerControl,
          }}
        />
      )}
    </Paper>
  )
}
