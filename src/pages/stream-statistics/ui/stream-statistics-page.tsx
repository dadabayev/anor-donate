import cn from './stream-statistics-page.module.css'

import {
  DISPLAY_METHOD_OPTIONS,
  loadStreamStatisticsSettings,
  readStreamStatisticsPageMode,
  saveStreamStatisticsSettings,
  STREAM_FONT_OPTIONS,
  STREAM_STATISTICS_COPY_ACTION,
  STREAM_STATISTICS_ERROR_TEXT,
  STREAM_STATISTICS_ERROR_TITLE,
  STREAM_STATISTICS_MODE_KEY,
  STREAM_STATISTICS_PAGE_SUBTITLE,
  STREAM_STATISTICS_PAGE_TITLE,
  STREAM_STATISTICS_RETRY_ACTION,
  STREAM_STATISTICS_SAVE_SUCCESS,
  type StreamStatisticsSectionKey,
  type StreamStatisticsSectionSettings,
  type StreamStatisticsSettings,
} from '../model/stream-statistics'
import { StreamStatisticsLoading, StreamStatisticsState } from './components'
import { notifications } from '@mantine/notifications'
import { ASSETS } from '@shared/constants'
import { IconChevronDown, IconLink } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

type SectionUiId = 'umumiy' | 'oylik' | 'oxirgi'

const SECTIONS: {
  uiId: SectionUiId
  settingsKey: StreamStatisticsSectionKey
  heading: string
}[] = [
  { uiId: 'umumiy', settingsKey: 'generalTop', heading: 'Umumiy top' },
  { uiId: 'oylik', settingsKey: 'monthlyTop', heading: 'Oylik top' },
  {
    uiId: 'oxirgi',
    settingsKey: 'recentDonations',
    heading: 'Oxirgi donatlar',
  },
]

const formatElementCount = (value: number) =>
  new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/,/g, ' ')

const ELEMENT_MIN = 1
const ELEMENT_MAX = 100

interface TopSectionFormProps {
  data: StreamStatisticsSectionSettings
  onPatch: (patch: Partial<StreamStatisticsSectionSettings>) => void
  copyFeedback: string
  onCopy: () => void
  onSave: () => void
  savePending: boolean
  saveDisabled: boolean
}

const TopSectionForm = ({
  data,
  onPatch,
  copyFeedback,
  onCopy,
  onSave,
  savePending,
  saveDisabled,
}: Readonly<TopSectionFormProps>) => {
  const elementValue = Math.min(
    ELEMENT_MAX,
    Math.max(ELEMENT_MIN, data.elementCount),
  )

  return (
    <div className={cn.expandedBody}>
      <div className={cn.linkBlock}>
        <p className={cn.fieldLabel}>Strim uchun havola</p>
        <div className={cn.linkRow}>
          <div className={cn.linkField}>
            <input
              className={cn.linkInput}
              type="url"
              value={data.streamLink}
              onChange={(e) => onPatch({ streamLink: e.target.value })}
              aria-label="Strim uchun havola"
            />
          </div>
          <button
            type="button"
            className={cn.copyButton}
            aria-label={STREAM_STATISTICS_COPY_ACTION}
            onClick={onCopy}
          >
            <IconLink size={22} stroke={2} />
          </button>
        </div>
        <div className={cn.liveRegion} aria-live="polite">
          {copyFeedback}
        </div>
      </div>

      <div className={cn.gridTwo}>
        <div className={cn.selectWrap}>
          <p className={cn.fieldLabel}>{`Ko'rsatish usuli`}</p>
          <div className={cn.selectField}>
            <select
              className={cn.select}
              value={data.displayMethod}
              onChange={(e) => onPatch({ displayMethod: e.target.value })}
              aria-label="Ko'rsatish usuli"
            >
              {DISPLAY_METHOD_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className={cn.selectChevron} aria-hidden>
              <IconChevronDown size={24} stroke={2} />
            </span>
          </div>
        </div>

        <div className={cn.selectWrap}>
          <p className={cn.fieldLabel}>Shrift</p>
          <div className={cn.selectField}>
            <select
              className={cn.select}
              value={data.fontFamily}
              onChange={(e) => onPatch({ fontFamily: e.target.value })}
              aria-label="Shrift"
            >
              {STREAM_FONT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className={cn.selectChevron} aria-hidden>
              <IconChevronDown size={24} stroke={2} />
            </span>
          </div>
        </div>
      </div>

      <div className={cn.sliderBlock}>
        <p className={cn.fieldLabel}>Elementlar soni</p>
        <div className={cn.sliderField}>
          <div className={cn.sliderValueRow}>
            <p className={cn.sliderValue}>{formatElementCount(elementValue)}</p>
            <span className={cn.sliderUnit}>Ta</span>
          </div>
          <input
            className={cn.range}
            type="range"
            min={ELEMENT_MIN}
            max={ELEMENT_MAX}
            value={elementValue}
            onChange={(e) => onPatch({ elementCount: Number(e.target.value) })}
            aria-valuemin={ELEMENT_MIN}
            aria-valuemax={ELEMENT_MAX}
            aria-valuenow={elementValue}
            aria-label="Elementlar soni"
          />
        </div>
      </div>

      <div className={cn.saveRow}>
        <button
          type="button"
          className={cn.saveButton}
          disabled={saveDisabled || savePending}
          onClick={onSave}
        >
          {savePending ? 'Saqlanmoqda…' : 'Saqlash'}
        </button>
      </div>
    </div>
  )
}

export const StreamStatisticsPage = () => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['stream-statistics-settings'],
    queryFn: loadStreamStatisticsSettings,
  })
  const [draft, setDraft] = useState<StreamStatisticsSettings | null>(null)
  const [openSection, setOpenSection] = useState<SectionUiId | null>('umumiy')
  const [copyFeedback, setCopyFeedback] = useState<{
    section: StreamStatisticsSectionKey
    text: string
  } | null>(null)

  const settings = draft ?? query.data ?? null

  useEffect(() => {
    if (!copyFeedback) {
      return
    }
    const t = window.setTimeout(() => setCopyFeedback(null), 1800)
    return () => window.clearTimeout(t)
  }, [copyFeedback])

  const saveMutation = useMutation({
    mutationFn: saveStreamStatisticsSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['stream-statistics-settings'], data)
      setDraft(data)
      notifications.show({
        title: 'Saqlandi',
        message: STREAM_STATISTICS_SAVE_SUCCESS,
        color: 'teal',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Saqlashda xato',
        message: "Sozlamalarni saqlab bo'lmadi. Qayta urinib ko'ring.",
        color: 'red',
      })
    },
  })

  const handleRetry = () => {
    window.localStorage.removeItem(STREAM_STATISTICS_MODE_KEY)
    setDraft(null)
    void query.refetch()
  }

  const handleToggleSection = (id: SectionUiId) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  const patchSection = (
    key: StreamStatisticsSectionKey,
    patch: Partial<StreamStatisticsSectionSettings>,
  ) => {
    setDraft((current) => {
      const base = current ?? query.data
      if (!base) {
        return current
      }
      return {
        ...base,
        [key]: { ...base[key], ...patch },
      }
    })
  }

  const handleCopyLink = async (sectionKey: StreamStatisticsSectionKey) => {
    if (!settings) {
      return
    }
    const streamLink = settings[sectionKey].streamLink
    try {
      await navigator.clipboard.writeText(streamLink)
      setCopyFeedback({ section: sectionKey, text: 'Havola nusxalandi' })
    } catch {
      setCopyFeedback({ section: sectionKey, text: "Nusxalab bo'lmadi" })
    }
  }

  if (query.isLoading) {
    return <StreamStatisticsLoading title={STREAM_STATISTICS_PAGE_TITLE} />
  }

  if (query.isError) {
    return (
      <StreamStatisticsState
        title={STREAM_STATISTICS_PAGE_TITLE}
        stateTitle={STREAM_STATISTICS_ERROR_TITLE}
        text={STREAM_STATISTICS_ERROR_TEXT}
        actionLabel={STREAM_STATISTICS_RETRY_ACTION}
        image={ASSETS.BUG_FIXING}
        onAction={handleRetry}
      />
    )
  }

  if (!settings) {
    return null
  }

  const saveBlockedByError = readStreamStatisticsPageMode() === 'error'

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <h1 className={cn.title}>{STREAM_STATISTICS_PAGE_TITLE}</h1>
          <p className={cn.subtitle}>{STREAM_STATISTICS_PAGE_SUBTITLE}</p>
        </header>

        <div className={cn.cardStack}>
          {SECTIONS.map(({ uiId, settingsKey, heading }) => {
            const isOpen = openSection === uiId
            const sectionData = settings[settingsKey]
            const feedbackCopy =
              copyFeedback?.section === settingsKey ? copyFeedback.text : ''

            return (
              <article
                key={uiId}
                className={classNames(
                  cn.card,
                  isOpen ? cn.cardExpanded : cn.cardCollapsed,
                )}
              >
                <button
                  type="button"
                  className={cn.cardHeader}
                  onClick={() => handleToggleSection(uiId)}
                  aria-expanded={isOpen}
                >
                  <h2 className={cn.cardTitle}>{heading}</h2>
                  <IconChevronDown
                    className={classNames(cn.chevron, isOpen && cn.chevronOpen)}
                    size={28}
                    stroke={1.8}
                  />
                </button>

                {isOpen ? (
                  <TopSectionForm
                    data={sectionData}
                    onPatch={(patch) => patchSection(settingsKey, patch)}
                    copyFeedback={feedbackCopy}
                    onCopy={() => {
                      void handleCopyLink(settingsKey)
                    }}
                    onSave={() => {
                      saveMutation.mutate(settings)
                    }}
                    savePending={saveMutation.isPending}
                    saveDisabled={saveBlockedByError}
                  />
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
