import cn from './home-page.module.css'

import { ChartTooltip } from '@shared/ui'
import { IconCalendar } from '@tabler/icons-react'
import type { PointerEvent } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LinePoint {
  x: number
  y: number
}

interface LineSeries {
  colorClass: string
  points: LinePoint[]
}

interface BarDatum {
  label: string
  value: number
  fullLabel: string
}

const lineChartWidth = 900
const lineChartHeight = 270
const chartPadding = { top: 18, right: 12, bottom: 28, left: 14 }
const chartLabels = ['02', '03', '04', '05', '06', '07', '08', '09', '10']
const selectedTickIndex = 7

const lineSeries: LineSeries[] = [
  {
    colorClass: cn.mainLine,
    points: [
      { x: 0, y: 116 },
      { x: 1, y: 116 },
      { x: 2, y: 116 },
      { x: 3, y: 136 },
      { x: 4, y: 120 },
      { x: 5, y: 102 },
      { x: 6, y: 94 },
      { x: 7, y: 132 },
      { x: 8, y: 154 },
      { x: 9, y: 150 },
      { x: 10, y: 118 },
      { x: 11, y: 100 },
      { x: 12, y: 84 },
      { x: 13, y: 76 },
      { x: 14, y: 78 },
      { x: 15, y: 62 },
      { x: 16, y: 64 },
      { x: 17, y: 82 },
      { x: 18, y: 72 },
      { x: 19, y: 72 },
      { x: 20, y: 68 },
      { x: 21, y: 74 },
      { x: 22, y: 72 },
      { x: 23, y: 64 },
      { x: 24, y: 58 },
      { x: 25, y: 60 },
      { x: 26, y: 48 },
      { x: 27, y: 36 },
      { x: 28, y: 22 },
      { x: 29, y: 8 },
    ],
  },
  {
    colorClass: cn.secondaryLine,
    points: [
      { x: 0, y: 170 },
      { x: 1, y: 170 },
      { x: 2, y: 170 },
      { x: 3, y: 182 },
      { x: 4, y: 170 },
      { x: 5, y: 160 },
      { x: 6, y: 156 },
      { x: 7, y: 188 },
      { x: 8, y: 202 },
      { x: 9, y: 198 },
      { x: 10, y: 160 },
      { x: 11, y: 148 },
      { x: 12, y: 126 },
      { x: 13, y: 116 },
      { x: 14, y: 122 },
      { x: 15, y: 108 },
      { x: 16, y: 118 },
      { x: 17, y: 126 },
      { x: 18, y: 120 },
      { x: 19, y: 122 },
      { x: 20, y: 118 },
      { x: 21, y: 114 },
      { x: 22, y: 108 },
      { x: 23, y: 100 },
      { x: 24, y: 86 },
      { x: 25, y: 70 },
      { x: 26, y: 60 },
      { x: 27, y: 52 },
      { x: 28, y: 44 },
      { x: 29, y: 44 },
    ],
  },
]

const toChartPoint = (value: number, index: number, total: number) => {
  const innerWidth = lineChartWidth - chartPadding.left - chartPadding.right
  const innerHeight = lineChartHeight - chartPadding.top - chartPadding.bottom
  const step = innerWidth / (total - 1)

  return {
    x: chartPadding.left + index * step,
    y: chartPadding.top + (innerHeight * value) / 202,
  }
}

const getChartValue = (point: LinePoint) => {
  const innerHeight = lineChartHeight - chartPadding.top - chartPadding.bottom
  const relativeY = point.y - chartPadding.top
  const normalized = Math.max(0, Math.min(1, 1 - relativeY / innerHeight))

  return Math.round(normalized * 100)
}

const getNearestTickIndex = (x: number, tickPositions: { x: number }[]) => {
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  tickPositions.forEach((tick, index) => {
    const distance = Math.abs(tick.x - x)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

const buildPath = (points: LinePoint[]) => {
  if (points.length === 0) {
    return ''
  }

  if (points.length === 1) {
    const [point] = points

    return `M ${point.x} ${point.y}`
  }

  const path: string[] = [`M ${points[0].x} ${points[0].y}`]

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index]
    const next = points[index + 1]
    const previous = points[index - 1] ?? current
    const afterNext = points[index + 2] ?? next

    const control1 = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    }
    const control2 = {
      x: next.x - (afterNext.x - current.x) / 6,
      y: next.y - (afterNext.y - current.y) / 6,
    }

    path.push(
      `C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${next.x} ${next.y}`,
    )
  }

  return path.join(' ')
}

export const HomePage = () => {
  const { t } = useTranslation()
  const barData: BarDatum[] = useMemo(
    () => [
      {
        label: t('dashboard.weekdaysShort.mon'),
        value: 70,
        fullLabel: t('dashboard.weekdays.mon'),
      },
      {
        label: t('dashboard.weekdaysShort.tue'),
        value: 47,
        fullLabel: t('dashboard.weekdays.tue'),
      },
      {
        label: t('dashboard.weekdaysShort.wed'),
        value: 28,
        fullLabel: t('dashboard.weekdays.wed'),
      },
      {
        label: t('dashboard.weekdaysShort.thu'),
        value: 74,
        fullLabel: t('dashboard.weekdays.thu'),
      },
      {
        label: t('dashboard.weekdaysShort.fri'),
        value: 46,
        fullLabel: t('dashboard.weekdays.fri'),
      },
    ],
    [t],
  )
  const topDonors = useMemo(
    () =>
      [1, 2, 3].map((i) => ({
        name: t('dashboard.topDonorName', { index: i }),
        amount: `1 200 000 ${t('common.currencyUzs')}`,
      })),
    [t],
  )
  const [hoveredTickIndex, setHoveredTickIndex] = useState<number | null>(null)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [isGoalChartHovered, setIsGoalChartHovered] = useState(false)
  const [isBadgeHovered, setIsBadgeHovered] = useState(false)
  const innerWidth = lineChartWidth - chartPadding.left - chartPadding.right
  const tickStep = innerWidth / (chartLabels.length - 1)
  const tickPositions = chartLabels.map((label, index) => ({
    label,
    x: chartPadding.left + index * tickStep,
  }))
  const activeTickIndex = hoveredTickIndex ?? selectedTickIndex
  const activeTick = tickPositions[activeTickIndex]
  const highlightWidth = 99
  const highlightX = activeTick.x - highlightWidth / 2
  const activePointIndex = Math.round(
    (activeTickIndex * (lineSeries[0].points.length - 1)) /
      (tickPositions.length - 1),
  )
  const primaryPoint = lineSeries[0].points[activePointIndex]
  const secondaryPoint = lineSeries[1].points[activePointIndex]
  const highlightedPoint = toChartPoint(
    primaryPoint.y,
    activePointIndex,
    lineSeries[0].points.length,
  )
  const tooltipLeft = (activeTick.x / lineChartWidth) * 100
  const tooltipTop = (highlightedPoint.y / lineChartHeight) * 100
  const clampedTooltipLeft = clamp(tooltipLeft, 7, 93)
  const lineTooltipAlign =
    clampedTooltipLeft <= 10
      ? 'start'
      : clampedTooltipLeft >= 90
        ? 'end'
        : 'center'
  const tooltipVisible = hoveredTickIndex !== null
  const handleLinePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * lineChartWidth

    setHoveredTickIndex(getNearestTickIndex(x, tickPositions))
  }

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.header}>
          <div>
            <h1 className={cn.title}>{t('dashboard.title')}</h1>
            <p className={cn.subtitle}>{t('dashboard.subtitle')}</p>
          </div>
          <div className={cn.filters}>
            <div className={cn.filterItem}>
              <span>{t('dashboard.dateFrom')}</span>
              <button type="button" className={cn.dateButton}>
                <IconCalendar size={24} stroke={1.75} />
                23.03.2026
              </button>
            </div>
            <div className={cn.filterItem}>
              <span>{t('dashboard.dateTo')}</span>
              <button type="button" className={cn.dateButton}>
                <IconCalendar size={24} stroke={1.75} />
                23.03.2026
              </button>
            </div>
          </div>
        </header>

        <section className={cn.summaryGrid}>
          <article className={cn.summaryCard}>
            <p>{t('dashboard.totalDonationsAmount')}</p>
            <strong>99 999 999 {t('common.currencyUzs')}</strong>
          </article>
          <article className={cn.summaryCard}>
            <p>{t('dashboard.totalDonationsCount')}</p>
            <strong>25 000 000 {t('common.currencyUzs')}</strong>
          </article>
        </section>

        <section className={cn.lineCard}>
          <h2 className={cn.lineCardTitle}>{t('dashboard.statistics')}</h2>
          <div className={cn.lineChartWrap}>
            <div className={cn.lineChartStage}>
              <svg
                className={cn.lineChart}
                viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
                xmlns="http://www.w3.org/2000/svg"
                aria-label={t('dashboard.lineChartAria')}
                onPointerMove={handleLinePointerMove}
                onPointerLeave={() => setHoveredTickIndex(null)}
              >
                <rect
                  x={highlightX}
                  y="0"
                  width={highlightWidth}
                  height={lineChartHeight}
                  className={cn.highlight}
                />
                {lineSeries.map((series) => {
                  const chartPoints = series.points.map((point, index) =>
                    toChartPoint(point.y, index, series.points.length),
                  )

                  return (
                    <path
                      key={series.colorClass}
                      className={series.colorClass}
                      d={buildPath(chartPoints)}
                    />
                  )
                })}
                <circle
                  className={cn.markerRing}
                  cx={highlightedPoint.x}
                  cy={highlightedPoint.y}
                  r="11"
                />
              </svg>
              <div className={cn.chartOverlay} aria-hidden="true">
                {tooltipVisible ? (
                  <>
                    <div
                      className={cn.chartGuide}
                      style={{ left: `${clampedTooltipLeft}%` }}
                    />
                    <ChartTooltip
                      visible={tooltipVisible}
                      title={t('dashboard.tooltipYear', {
                        day: activeTick.label,
                        year: 2026,
                      })}
                      align={lineTooltipAlign}
                      left={clampedTooltipLeft}
                      top={Math.max(tooltipTop - 1, 12)}
                      items={[
                        {
                          label: t('dashboard.seriesPrimary'),
                          value: `${getChartValue(primaryPoint)}`,
                          color: '#1e1e1e',
                        },
                        {
                          label: t('dashboard.seriesSecondary'),
                          value: `${getChartValue(secondaryPoint)}`,
                          color: '#8b0037',
                        },
                      ]}
                    />
                  </>
                ) : null}
              </div>
            </div>
            <div className={cn.xAxis}>
              {tickPositions.map((tick, index) => (
                <span
                  key={tick.label}
                  className={
                    index === selectedTickIndex ? cn.xAxisActive : undefined
                  }
                >
                  {tick.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={cn.bottomGrid}>
          <article className={cn.donationCard}>
            <div className={cn.donationHeader}>
              <h2>{t('dashboard.donationsCount')}</h2>
              <span
                className={cn.badge}
                onMouseEnter={() => setIsBadgeHovered(true)}
                onMouseLeave={() => setIsBadgeHovered(false)}
                onFocus={() => setIsBadgeHovered(true)}
                onBlur={() => setIsBadgeHovered(false)}
                tabIndex={0}
              >
                85
                <ChartTooltip
                  visible={isBadgeHovered}
                  title={t('dashboard.tooltipTotalDonations')}
                  left={50}
                  top={0}
                  align="center"
                  className={cn.donationTooltip}
                  items={[
                    {
                      label: t('dashboard.count'),
                      value: '85',
                      color: '#8b0037',
                    },
                  ]}
                />
              </span>
            </div>
            <div className={cn.donationBody}>
              <div className={cn.bars}>
                {barData.map((bar, index) => (
                  <div
                    key={`${bar.label}-${index}`}
                    className={cn.barItem}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    onFocus={() => setHoveredBarIndex(index)}
                    onBlur={() => setHoveredBarIndex(null)}
                    tabIndex={0}
                  >
                    <ChartTooltip
                      visible={hoveredBarIndex === index}
                      title={bar.fullLabel}
                      left={
                        index === 0
                          ? 0
                          : index === barData.length - 1
                            ? 100
                            : 50
                      }
                      top={0}
                      align={
                        index === 0
                          ? 'start'
                          : index === barData.length - 1
                            ? 'end'
                            : 'center'
                      }
                      className={cn.donationTooltip}
                      items={[
                        {
                          label: t('dashboard.donationShare'),
                          value: `${bar.value}%`,
                          color: '#8b0037',
                        },
                      ]}
                    />
                    <div className={cn.barTrack}>
                      <div
                        className={cn.barFill}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                    <span>{bar.label}</span>
                  </div>
                ))}
              </div>
              <div
                className={cn.goalChart}
                onMouseEnter={() => setIsGoalChartHovered(true)}
                onMouseLeave={() => setIsGoalChartHovered(false)}
                onFocus={() => setIsGoalChartHovered(true)}
                onBlur={() => setIsGoalChartHovered(false)}
                tabIndex={0}
              >
                <div className={cn.goalRing} />
                <div className={cn.goalLabels}>
                  <span className={cn.goalTitle}>{t('dashboard.goal')}</span>
                  <span className={cn.goalPercent}>65%</span>
                </div>
                <ChartTooltip
                  visible={isGoalChartHovered}
                  title={t('dashboard.weeklyGoal')}
                  left={50}
                  top={16}
                  align="center"
                  className={cn.donationTooltip}
                  items={[
                    {
                      label: t('dashboard.done'),
                      value: '65%',
                      color: '#8b0037',
                    },
                    {
                      label: t('dashboard.remaining'),
                      value: '35%',
                      color: '#fceef4',
                    },
                  ]}
                />
              </div>
            </div>
          </article>

          <aside className={cn.topDonors}>
            {topDonors.map((donor, index) => (
              <article
                key={`${donor.name}-${index}`}
                className={cn.topDonorCard}
              >
                <h3>{donor.name}</h3>
                <p>{donor.amount}</p>
              </article>
            ))}
          </aside>
        </section>
      </div>
    </section>
  )
}
