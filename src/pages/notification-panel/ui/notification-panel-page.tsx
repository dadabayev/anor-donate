import cn from './notification-panel-page.module.css'

import { ASSETS } from '@shared/constants'
import { formatAudioTime, useAudioWaveform } from '@shared/lib/audio'
import {
  IconExternalLink,
  IconHeart,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

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

const AUDIO_SOURCE = ASSETS.NOTIFICATION_SAMPLE_WAV

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
  bars: number[]
  currentTime: number
  duration: number
  progress: number
  isPlaying: boolean
  cardId: string
}

const MusicWaveformPlayer = ({
  bars,
  currentTime,
  duration,
  progress,
  isPlaying,
  cardId,
}: MusicWaveformPlayerProps) => (
  <div className={cn.musicPlayerWrapper}>
    <div className={cn.waveRow}>
      <span className={cn.waveTime}>{formatAudioTime(currentTime)}</span>
      <div className={cn.staticWaveform}>
        {bars.map((height, index) => (
          <AnimatedWaveBar
            key={`${cardId}-${index}`}
            height={height}
            isPlayed={index / bars.length < progress}
            isPlaying={isPlaying}
            delay={index * 40}
          />
        ))}
      </div>
      <span className={cn.waveTime}>{formatAudioTime(duration)}</span>
    </div>
  </div>
)

const MusicNotificationCard = ({ card }: { card: MessageCard }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformBars = useAudioWaveform({
    barCount: 30,
    maxHeight: 100,
    minHeight: 14,
    src: AUDIO_SOURCE,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progress = duration > 0 ? currentTime / duration : 0

  useEffect(() => {
    if (!audioRef.current) {
      return undefined
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handlePause)
    audio.addEventListener('play', handlePlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handlePause)
      audio.removeEventListener('play', handlePlay)
    }
  }, [])

  const handleTogglePlayback = async () => {
    if (!audioRef.current) {
      return
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      audioRef.current.pause()
    }
  }

  const handleRestart = async () => {
    if (!audioRef.current) {
      return
    }

    audioRef.current.currentTime = 0
    setCurrentTime(0)

    try {
      await audioRef.current.play()
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <article className={`${cn.card} ${cn.musicCard}`}>
      <div className={`${cn.cardBody} ${cn.musicCardBody}`}>
        <h2 className={cn.cardTitle}>
          <IconHeart size={17} stroke={2} className={cn.cardTitleIcon} />
          <span>{card.title}</span>
        </h2>

        {card.description ? (
          <p className={cn.description}>{card.description}</p>
        ) : null}

        <MusicWaveformPlayer
          cardId={card.id}
          bars={waveformBars}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          isPlaying={isPlaying}
        />

        <audio ref={audioRef} src={AUDIO_SOURCE} preload="metadata" hidden />

        <p className={cn.timestamp}>{card.timestamp}</p>
      </div>

      <div className={cn.cardActions} aria-label="Xabar amallari">
        <button
          type="button"
          className={cn.secondaryAction}
          aria-label="Restart audio"
          onClick={handleRestart}
        >
          <IconRefresh size={20} stroke={2.1} />
        </button>
        <button
          type="button"
          className={cn.strongAction}
          aria-label={isPlaying ? 'Pause playback' : 'Play playback'}
          onClick={handleTogglePlayback}
        >
          {isPlaying ? (
            <IconPlayerPauseFilled size={20} />
          ) : (
            <IconPlayerPlayFilled size={20} />
          )}
        </button>
      </div>
    </article>
  )
}

const NotificationMessageCard = ({ card }: { card: MessageCard }) => (
  <article className={cn.card}>
    <div className={cn.cardBody}>
      <h2 className={cn.cardTitle}>
        <IconHeart size={17} stroke={2} className={cn.cardTitleIcon} />
        <span>{card.title}</span>
      </h2>

      {card.description ? (
        <p className={cn.description}>{card.description}</p>
      ) : null}
      <p className={cn.timestamp}>{card.timestamp}</p>
    </div>

    <div className={cn.cardActions} aria-label="Xabar amallari">
      <button
        type="button"
        className={cn.secondaryAction}
        aria-label="Refresh message"
      >
        <IconRefresh size={20} stroke={2.1} />
      </button>
      <button
        type="button"
        className={cn.strongAction}
        aria-label="Pause playback"
      >
        <IconPlayerPauseFilled size={20} />
      </button>
    </div>
  </article>
)

const NotificationCard = ({ card }: { card: MessageCard }) =>
  card.type === 'music' ? (
    <MusicNotificationCard card={card} />
  ) : (
    <NotificationMessageCard card={card} />
  )

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
