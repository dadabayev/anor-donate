import cn from './widgets-page.module.css'

import {
  loadWidgetsDashboard,
  type WidgetConfig,
  WIDGETS_COPY_ACTION,
  WIDGETS_CREATE_ACTION,
  WIDGETS_EMPTY_ACTION,
  WIDGETS_EMPTY_TEXT,
  WIDGETS_EMPTY_TITLE,
  WIDGETS_ERROR_TEXT,
  WIDGETS_ERROR_TITLE,
  WIDGETS_MODE_KEY,
  WIDGETS_PAGE_SUBTITLE,
  WIDGETS_PAGE_TITLE,
  WIDGETS_RETRY_ACTION,
  type WidgetsDashboardData,
} from '../model/widgets'
import { WidgetsLoading, WidgetsState } from './components'
import { ASSETS } from '@shared/constants'
import { useAudioWaveform } from '@shared/lib/audio/use-audio-waveform'
import { formatAudioTime } from '@shared/lib/audio/waveform'
import {
  IconChevronDown,
  IconCopy,
  IconLink,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUDIO_SOURCE = ASSETS.NOTIFICATION_SAMPLE_WAV

const formatAmount = (value: number) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)

const PreviewCard = ({ widget }: { widget: WidgetConfig }) => {
  return (
    <div className={cn.previewArtwork}>
      <img
        className={cn.previewBanner}
        src={ASSETS.DEMO_WIDGET_BANNER}
        alt=""
        decoding="async"
      />
      <div className={cn.previewLogoWrap} aria-hidden="true">
        <img
          className={cn.previewLogo}
          src={ASSETS.LOGO}
          alt=""
          decoding="async"
        />
      </div>
      <span className={cn.previewBadge}>{widget.title}</span>
    </div>
  )
}

interface AudioPreviewProps {
  bars: number[]
  durationSeconds: number
  isPlaying: boolean
  progress: number
  elapsedSeconds: number
  onToggle: () => void
}

const AudioPreview = ({
  bars,
  durationSeconds,
  isPlaying,
  progress,
  elapsedSeconds,
  onToggle,
}: Readonly<AudioPreviewProps>) => {
  const activeBars = Math.round(progress * bars.length)

  return (
    <div className={cn.audioRow}>
      <button
        type="button"
        className={classNames(cn.playButton, isPlaying && cn.playButtonActive)}
        onClick={onToggle}
        aria-label={
          isPlaying
            ? 'Audio previewni pauza qilish'
            : 'Audio previewni tinglash'
        }
      >
        {isPlaying ? (
          <IconPlayerPauseFilled size={16} />
        ) : (
          <IconPlayerPlayFilled size={16} />
        )}
      </button>
      <span className={cn.audioTime}>{formatAudioTime(elapsedSeconds)}</span>
      <div className={cn.waveform} aria-hidden="true">
        {bars.map((barHeight: number, index: number) => (
          <span
            key={`${barHeight}-${index}`}
            className={classNames(
              cn.waveBar,
              index < activeBars && cn.waveBarActive,
            )}
            style={{ height: `${barHeight}px` }}
          />
        ))}
      </div>
      <span className={cn.audioTime}>{formatAudioTime(durationSeconds)}</span>
    </div>
  )
}

interface AppearanceSwatchProps {
  accentColor: string
  label: string
  value: string
}

const AppearanceSwatch = ({
  accentColor,
  label,
  value,
}: Readonly<AppearanceSwatchProps>) => (
  <div className={cn.swatchCard}>
    <div
      className={cn.swatchSample}
      style={{ backgroundColor: accentColor }}
      aria-hidden="true"
    />
    <div className={cn.swatchText}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  </div>
)

interface WidgetCardProps {
  widget: WidgetConfig
  waveformBars: number[]
  audioDurationSeconds: number
  isExpanded: boolean
  isPlaying: boolean
  playbackProgress: number
  playbackSeconds: number
  onEdit: (widgetId: string) => void
  onToggleAudio: (widgetId: string) => void
  onToggleExpanded: (widgetId: string) => void
  onToggleAutoRead: (widgetId: string) => void
}

const WidgetCard = ({
  widget,
  waveformBars,
  audioDurationSeconds,
  isExpanded,
  isPlaying,
  playbackProgress,
  playbackSeconds,
  onEdit,
  onToggleAudio,
  onToggleExpanded,
  onToggleAutoRead,
}: Readonly<WidgetCardProps>) => {
  const autoReadLabelId = `${widget.id}-autoplay-label`

  return (
    <article
      className={classNames(
        cn.widgetCard,
        !isExpanded && cn.widgetCardCollapsed,
      )}
    >
      <button
        type="button"
        className={cn.widgetHeader}
        onClick={() => onToggleExpanded(widget.id)}
        aria-expanded={isExpanded}
      >
        <h2 className={cn.widgetTitle}>{widget.title}</h2>
        <IconChevronDown
          className={classNames(
            cn.widgetChevron,
            isExpanded && cn.widgetChevronOpen,
          )}
          size={28}
          stroke={1.8}
        />
      </button>

      {isExpanded ? (
        <div className={cn.widgetContent}>
          <div className={cn.previewPanel}>
            <PreviewCard widget={widget} />
          </div>

          <div className={cn.widgetMeta}>
            <div className={cn.widgetSummaryGrid}>
              <div className={cn.summaryMetric}>
                <span className={cn.summaryLabel}>
                  Dan katta yoki teng miqdor
                </span>
                <strong className={cn.summaryValue}>
                  {formatAmount(widget.minimumAmount)}
                  <small>UZS</small>
                </strong>
              </div>

              <div className={cn.summaryMetric}>
                <span className={cn.summaryLabel}>Tovush balandligi</span>
                <strong className={cn.summaryValue}>
                  {widget.volumePercent}
                  <small>%</small>
                </strong>
              </div>

              <div className={cn.summaryMetric}>
                <span className={cn.summaryLabel}>Donat davomiyligi</span>
                <strong className={cn.summaryValue}>
                  {widget.durationSeconds}
                  <small>s</small>
                </strong>
              </div>

              <div className={cn.summaryMetric}>
                <span className={cn.summaryLabel} id={autoReadLabelId}>
                  Xabarni avto o'qish
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={widget.autoReadMessage}
                  aria-labelledby={autoReadLabelId}
                  className={classNames(
                    cn.switch,
                    widget.autoReadMessage ? cn.switchActive : cn.switchIdle,
                  )}
                  onClick={() => onToggleAutoRead(widget.id)}
                >
                  <span className={cn.switchKnob} />
                </button>
              </div>
            </div>

            <div className={cn.widgetAudioSection}>
              <div className={cn.summaryMetric}>
                <span className={cn.summaryLabel}>Ovoz ohangi</span>
                <strong className={cn.summaryVoice}>{widget.voiceTone}</strong>
              </div>

              <AudioPreview
                bars={waveformBars}
                durationSeconds={audioDurationSeconds}
                isPlaying={isPlaying}
                progress={playbackProgress}
                elapsedSeconds={playbackSeconds}
                onToggle={() => onToggleAudio(widget.id)}
              />
            </div>

            <div className={cn.widgetSettingsRow}>
              <AppearanceSwatch
                accentColor={widget.appearance.nameColor}
                label="Ism rangi"
                value={widget.appearance.nameColor}
              />
              <AppearanceSwatch
                accentColor={widget.appearance.textColor}
                label="Matn rangi"
                value={widget.appearance.textColor}
              />
              <div className={cn.fontCard}>
                <span
                  className={cn.fontSample}
                  style={{ fontFamily: widget.appearance.fontFamily }}
                >
                  Aa
                </span>
                <div className={cn.swatchText}>
                  <strong>Shrift</strong>
                  <span>{widget.appearance.fontFamily}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={cn.secondaryButton}
              onClick={() => onEdit(widget.id)}
            >
              <span>Tahrirlash</span>
            </button>
          </div>
        </div>
      ) : null}
    </article>
  )
}

export const WidgetsPage = () => {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['widgets-page'],
    queryFn: loadWidgetsDashboard,
  })
  const [dashboardState, setDashboardState] =
    useState<WidgetsDashboardData | null>(null)
  const [expandedWidgetIdState, setExpandedWidgetIdState] = useState<
    string | null
  >(null)
  const [playingWidgetId, setPlayingWidgetId] = useState<string | null>(null)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [playbackSeconds, setPlaybackSeconds] = useState(0)
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0)
  const [copyFeedback, setCopyFeedback] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const waveformBars = useAudioWaveform({
    barCount: 32,
    maxHeight: 26,
    minHeight: 8,
    src: AUDIO_SOURCE,
  })
  const dashboard = dashboardState ?? query.data ?? null
  const widgets = dashboard?.widgets ?? []
  const streamLink = dashboard?.streamLink ?? ''
  const expandedWidgetId = expandedWidgetIdState ?? widgets[0]?.id ?? null

  useEffect(() => {
    if (!copyFeedback) {
      return
    }

    const timer = window.setTimeout(() => {
      setCopyFeedback('')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [copyFeedback])

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    const audio = audioRef.current

    const handleTimeUpdate = () => {
      const currentSeconds = Math.max(0, audio.currentTime)
      const duration = audio.duration || 0

      setPlaybackSeconds(currentSeconds)
      setPlaybackProgress(
        duration > 0 ? Math.max(0, Math.min(currentSeconds / duration, 1)) : 0,
      )
    }

    const handlePause = () => {
      setPlayingWidgetId(null)
    }

    const handleLoadedMetadata = () => {
      setAudioDurationSeconds(audio.duration || 0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handlePause)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handlePause)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const updateDashboard = (
    updater: (current: WidgetsDashboardData) => WidgetsDashboardData,
  ) => {
    setDashboardState((current) => {
      const baseDashboard = current ?? query.data

      if (!baseDashboard) {
        return current
      }

      return updater(baseDashboard)
    })
  }

  const handleRetry = () => {
    window.localStorage.removeItem(WIDGETS_MODE_KEY)
    setDashboardState(null)
    setExpandedWidgetIdState(null)
    void query.refetch()
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(streamLink)
      setCopyFeedback('Havola nusxalandi')
    } catch {
      setCopyFeedback("Nusxalab bo'lmadi")
    }
  }

  const handleToggleExpanded = (widgetId: string) => {
    setExpandedWidgetIdState((current) =>
      current === widgetId ? null : widgetId,
    )
  }

  const handleToggleAutoRead = (widgetId: string) => {
    updateDashboard((current) => ({
      ...current,
      widgets: current.widgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, autoReadMessage: !widget.autoReadMessage }
          : widget,
      ),
    }))
  }

  const handleToggleAudio = async (widgetId: string) => {
    if (!audioRef.current) {
      return
    }

    const audio = audioRef.current

    if (playingWidgetId === widgetId) {
      audio.pause()
      return
    }

    try {
      audio.currentTime = 0
      setPlaybackSeconds(0)
      setPlaybackProgress(0)
      setPlayingWidgetId(widgetId)
      await audio.play()
    } catch {
      setPlayingWidgetId(null)
    }
  }

  if (query.isLoading) {
    return <WidgetsLoading title={WIDGETS_PAGE_TITLE} />
  }

  if (query.isError) {
    return (
      <WidgetsState
        title={WIDGETS_PAGE_TITLE}
        stateTitle={WIDGETS_ERROR_TITLE}
        text={WIDGETS_ERROR_TEXT}
        actionLabel={WIDGETS_RETRY_ACTION}
        image={ASSETS.BUG_FIXING}
        onAction={handleRetry}
      />
    )
  }

  if (widgets.length === 0) {
    return (
      <WidgetsState
        title={WIDGETS_PAGE_TITLE}
        stateTitle={WIDGETS_EMPTY_TITLE}
        text={WIDGETS_EMPTY_TEXT}
        actionLabel={WIDGETS_EMPTY_ACTION}
        image={ASSETS.DEVELOPMENT}
        onAction={() => {
          void navigate('/widgets/create')
        }}
      />
    )
  }

  return (
    <section className={cn.page}>
      <audio ref={audioRef} src={AUDIO_SOURCE} preload="metadata" hidden />

      <div className={cn.column}>
        <header className={cn.hero}>
          <div className={cn.heroText}>
            <h1 className={cn.title}>{WIDGETS_PAGE_TITLE}</h1>
            <p className={cn.subtitle}>{WIDGETS_PAGE_SUBTITLE}</p>
          </div>

          <button
            type="button"
            className={cn.primaryButton}
            onClick={() => {
              void navigate('/widgets/create')
            }}
          >
            {WIDGETS_CREATE_ACTION}
          </button>
        </header>

        <section className={cn.linkCard}>
          <h2 className={cn.linkTitle}>Strim uchun havola:</h2>
          <div className={cn.linkRow}>
            <div className={cn.linkField}>
              <IconLink className={cn.linkFieldIcon} size={18} stroke={2} />
              <input
                className={cn.linkInput}
                type="url"
                value={streamLink}
                onChange={(event) =>
                  updateDashboard((current) => ({
                    ...current,
                    streamLink: event.target.value,
                  }))
                }
                aria-label="Strim uchun havola"
              />
            </div>
            <button
              type="button"
              className={cn.copyButton}
              aria-label={WIDGETS_COPY_ACTION}
              onClick={handleCopyLink}
            >
              <IconCopy size={22} stroke={2} />
            </button>
          </div>
          <div className={cn.liveRegion} aria-live="polite">
            {copyFeedback}
          </div>
        </section>

        <div className={cn.widgetStack}>
          {widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              waveformBars={waveformBars}
              audioDurationSeconds={audioDurationSeconds}
              isExpanded={expandedWidgetId === widget.id}
              isPlaying={playingWidgetId === widget.id}
              playbackProgress={
                playingWidgetId === widget.id ? playbackProgress : 0
              }
              playbackSeconds={
                playingWidgetId === widget.id ? playbackSeconds : 0
              }
              onEdit={(widgetId) => {
                void navigate(`/widgets/${widgetId}/edit`)
              }}
              onToggleAudio={handleToggleAudio}
              onToggleExpanded={handleToggleExpanded}
              onToggleAutoRead={handleToggleAutoRead}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
