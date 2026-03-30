import cn from './notification-panel-page.module.css'

import {
  IconExternalLink,
  IconHeart,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'
import { type CSSProperties, useEffect, useState } from 'react'

type CardType = 'notification' | 'music'

interface MessageCard {
  id: string
  type: CardType
  title: string
  description?: string
  timestamp: string
}

const messageCards: MessageCard[] = [
  {
    id: '1',
    type: 'notification',
    title: 'Anonim - 25 000 000',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type",
    timestamp: '1-daqiqa oldin 12.03.2026',
  },
  {
    id: '2',
    type: 'notification',
    title: 'Anonim - 25 000 000',
    timestamp: '1-daqiqa oldin 12.03.2026',
  },
  {
    id: '3',
    type: 'music',
    title: 'Anonim - 25 000 000',
    timestamp: '1-daqiqa oldin 12.03.2026',
  },
]

const actionButtons = [
  {
    id: 'refresh',
    icon: IconRefresh,
    label: 'Refresh',
    className: cn.primaryAction,
  },
  {
    id: 'open',
    icon: IconExternalLink,
    label: 'Open in new window',
    className: cn.primaryAction,
  },
] as const

const INITIAL_PROGRESS = 8
const TOTAL_DURATION = 30
const WAVE_STEP_SECONDS = 0.6

const formatTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = Math.floor(safeSeconds % 60)

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

const barHeights = [
  14, 22, 30, 44, 36, 54, 64, 72, 68, 90, 100, 84, 72, 58, 46, 52, 74, 92, 70,
  58, 48, 36, 28, 24, 30, 40, 52, 62, 48, 34,
]

interface AnimatedWaveBarProps {
  height: number
  isPlayed: boolean
  isPlaying: boolean
  delay: number
}

const AnimatedWaveBar = ({
  height,
  isPlayed,
  isPlaying,
  delay,
}: AnimatedWaveBarProps) => (
  <span
    className={`${cn.waveBar} ${isPlaying ? cn.waveBarPlaying : ''}`}
    style={
      {
        height: `${height}px`,
        animationDelay: `${delay}ms`,
      } as CSSProperties
    }
    data-played={isPlayed}
  />
)

interface MusicWaveformPlayerProps {
  currentTime: number
  duration: number
  progress: number
  isPlaying: boolean
  cardId: string
}

const MusicWaveformPlayer = ({
  currentTime,
  duration,
  progress,
  isPlaying,
  cardId,
}: MusicWaveformPlayerProps) => (
  <div className={cn.musicPlayerWrapper}>
    <div className={cn.waveRow}>
      <span className={cn.waveTime}>{formatTime(currentTime)}</span>
      <div className={cn.staticWaveform}>
        {barHeights.map((height, index) => (
          <AnimatedWaveBar
            key={`${cardId}-${index}`}
            height={height}
            isPlayed={index / barHeights.length < progress}
            isPlaying={isPlaying}
            delay={index * 40}
          />
        ))}
      </div>
      <span className={cn.waveTime}>{formatTime(duration)}</span>
    </div>
  </div>
)

const NotificationCard = ({ card }: { card: MessageCard }) => {
  const isMusic = card.type === 'music'
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(INITIAL_PROGRESS)
  const duration = TOTAL_DURATION
  const [progress, setProgress] = useState(INITIAL_PROGRESS / TOTAL_DURATION)

  useEffect(() => {
    if (!isMusic || !isPlaying) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCurrentTime((value) => {
        const next = Math.min(value + WAVE_STEP_SECONDS, duration)
        setProgress(duration > 0 ? next / duration : 0)

        if (next >= duration) {
          setIsPlaying(false)
        }

        return next
      })
    }, 600)

    return () => window.clearInterval(timer)
  }, [duration, isMusic, isPlaying])

  const handleTogglePlayback = () => {
    if (!isMusic) {
      return
    }

    setIsPlaying((value) => !value)
  }

  const handleRestart = () => {
    if (!isMusic) {
      return
    }

    setCurrentTime(INITIAL_PROGRESS)
    setProgress(INITIAL_PROGRESS / duration)
    setIsPlaying(true)
  }

  return (
    <article className={`${cn.card} ${isMusic ? cn.musicCard : ''}`}>
      <div className={`${cn.cardBody} ${isMusic ? cn.musicCardBody : ''}`}>
        <h2 className={cn.cardTitle}>
          <IconHeart size={17} stroke={2} className={cn.cardTitleIcon} />
          <span>{card.title}</span>
        </h2>

        {card.description ? (
          <p className={cn.description}>{card.description}</p>
        ) : null}

        {isMusic ? (
          <MusicWaveformPlayer
            cardId={card.id}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            isPlaying={isPlaying}
          />
        ) : null}

        <p className={cn.timestamp}>{card.timestamp}</p>
      </div>

      <div className={cn.cardActions} aria-label="Xabar amallari">
        <button
          type="button"
          className={cn.secondaryAction}
          aria-label={isMusic ? 'Restart audio' : 'Refresh message'}
          onClick={isMusic ? handleRestart : undefined}
        >
          <IconRefresh size={20} stroke={2.1} />
        </button>
        <button
          type="button"
          className={cn.strongAction}
          aria-label={
            isMusic
              ? isPlaying
                ? 'Pause playback'
                : 'Play playback'
              : 'Pause playback'
          }
          onClick={isMusic ? handleTogglePlayback : undefined}
        >
          {isMusic && isPlaying ? (
            <IconPlayerPauseFilled size={20} />
          ) : isMusic ? (
            <IconPlayerPlayFilled size={20} />
          ) : (
            <IconPlayerPauseFilled size={20} />
          )}
        </button>
      </div>
    </article>
  )
}

export const NotificationPanelPage = () => {
  return (
    <section className={cn.page}>
      <header className={cn.header}>
        <h1 className={cn.title}>Notification Panel</h1>

        <div className={cn.toolbar}>
          <label className={cn.searchField}>
            <span className={cn.srOnly}>Qidirish</span>
            <input
              type="search"
              className={cn.searchInput}
              placeholder="Ism,matn yoki miqdor boyicha qidirish..."
            />
            <IconSearch size={20} stroke={2.1} className={cn.searchIcon} />
          </label>

          <div className={cn.toolbarActions}>
            {actionButtons.map((button) => {
              const Icon = button.icon

              return (
                <button
                  key={button.id}
                  type="button"
                  className={button.className}
                  aria-label={button.label}
                >
                  <Icon size={20} stroke={2.1} />
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <section className={cn.cards} aria-label="Notifications list">
        {messageCards.map((card) => (
          <NotificationCard key={card.id} card={card} />
        ))}
      </section>
    </section>
  )
}
