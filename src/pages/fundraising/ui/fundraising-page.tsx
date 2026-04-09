import cn from './fundraising-page.module.css'

import {
  FUNDRAISING_ERROR_TEXT,
  FUNDRAISING_ERROR_TITLE,
  FUNDRAISING_PAGE_MODE_KEY,
  FUNDRAISING_PAGE_SUBTITLE,
  FUNDRAISING_PAGE_TITLE,
  FUNDRAISING_RETRY_ACTION,
  FUNDRAISING_SAVE_SUCCESS,
  type FundraisingSettings,
  loadFundraisingSettings,
  readFundraisingPageMode,
  saveFundraisingSettings,
} from '../model/fundraising'
import { FundraisingLoading, FundraisingState } from './components'
import { notifications } from '@mantine/notifications'
import { ASSETS } from '@shared/constants'
import { IconLink } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

const UZS_MIN = 0
const UZS_MAX = 100_000
const UZS_STEP = 500

const formatUzAmount = (value: number) =>
  new Intl.NumberFormat('uz-UZ', {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/,/g, ' ')

const ANIMATION_OPTIONS = [
  { id: 'a' as const, label: '1' },
  { id: 'b' as const, label: '2' },
  { id: 'c' as const, label: '3' },
]

export const FundraisingPage = () => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['fundraising-settings'],
    queryFn: loadFundraisingSettings,
  })
  const [draft, setDraft] = useState<FundraisingSettings | null>(null)
  const [copyFeedback, setCopyFeedback] = useState('')

  const settings = draft ?? query.data ?? null

  useEffect(() => {
    if (!copyFeedback) {
      return
    }
    const t = window.setTimeout(() => setCopyFeedback(''), 1800)
    return () => window.clearTimeout(t)
  }, [copyFeedback])

  const saveMutation = useMutation({
    mutationFn: saveFundraisingSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['fundraising-settings'], data)
      setDraft(data)
      notifications.show({
        title: 'Saqlandi',
        message: FUNDRAISING_SAVE_SUCCESS,
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
    window.localStorage.removeItem(FUNDRAISING_PAGE_MODE_KEY)
    setDraft(null)
    void query.refetch()
  }

  const handleCopyLink = async () => {
    if (!settings?.streamLink) {
      return
    }
    try {
      await navigator.clipboard.writeText(settings.streamLink)
      setCopyFeedback('Havola nusxalandi')
    } catch {
      setCopyFeedback("Nusxalab bo'lmadi")
    }
  }

  const updateDraft = (patch: Partial<FundraisingSettings>) => {
    setDraft((current) => {
      const base = current ?? query.data
      if (!base) {
        return current
      }
      return { ...base, ...patch }
    })
  }

  if (query.isLoading) {
    return <FundraisingLoading title={FUNDRAISING_PAGE_TITLE} />
  }

  if (query.isError) {
    return (
      <FundraisingState
        title={FUNDRAISING_PAGE_TITLE}
        stateTitle={FUNDRAISING_ERROR_TITLE}
        text={FUNDRAISING_ERROR_TEXT}
        actionLabel={FUNDRAISING_RETRY_ACTION}
        image={ASSETS.BUG_FIXING}
        onAction={handleRetry}
      />
    )
  }

  if (!settings) {
    return null
  }

  const clampUzs = (n: number) => Math.min(UZS_MAX, Math.max(UZS_MIN, n))

  const volumeValue = clampUzs(settings.volumeUzs)
  const durationValue = clampUzs(settings.durationUzs)

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.hero}>
          <h1 className={cn.title}>{FUNDRAISING_PAGE_TITLE}</h1>
          <p className={cn.subtitle}>{FUNDRAISING_PAGE_SUBTITLE}</p>
        </header>

        <div className={cn.stack}>
          <section className={cn.linkCard}>
            <h2 className={cn.cardTitle}>Strim uchun havola</h2>
            <div className={cn.linkRow}>
              <div className={cn.linkField}>
                <input
                  className={cn.linkInput}
                  type="url"
                  value={settings.streamLink}
                  onChange={(e) => updateDraft({ streamLink: e.target.value })}
                  aria-label="Strim uchun havola"
                />
              </div>
              <button
                type="button"
                className={cn.copyButton}
                aria-label="Havolani nusxalash"
                onClick={handleCopyLink}
              >
                <IconLink size={22} stroke={2} />
              </button>
            </div>
            <div className={cn.liveRegion} aria-live="polite">
              {copyFeedback}
            </div>
          </section>

          <section className={cn.blockCard}>
            <h2 className={cn.sectionTitle}>Umumiy top</h2>

            <div className={cn.nameField}>
              <p className={cn.fieldLabel}>Nomi</p>
              <input
                className={cn.textInput}
                type="text"
                value={settings.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                aria-label="Nomi"
              />
            </div>

            <div className={cn.gridTwo}>
              <div className={cn.sliderField}>
                <p className={cn.fieldLabel}>Tovush balandligi</p>
                <div className={cn.sliderValueRow}>
                  <p className={cn.sliderValue}>
                    {formatUzAmount(volumeValue)}
                  </p>
                  <span className={cn.sliderUnit}>UZS</span>
                </div>
                <input
                  className={cn.range}
                  type="range"
                  min={UZS_MIN}
                  max={UZS_MAX}
                  step={UZS_STEP}
                  value={volumeValue}
                  onChange={(e) =>
                    updateDraft({ volumeUzs: Number(e.target.value) })
                  }
                  aria-valuemin={UZS_MIN}
                  aria-valuemax={UZS_MAX}
                  aria-valuenow={volumeValue}
                  aria-label="Tovush balandligi"
                />
              </div>

              <div className={cn.sliderField}>
                <p className={cn.fieldLabel}>Donat davomiyligi</p>
                <div className={cn.sliderValueRow}>
                  <p className={cn.sliderValue}>
                    {formatUzAmount(durationValue)}
                  </p>
                  <span className={cn.sliderUnit}>UZS</span>
                </div>
                <input
                  className={cn.range}
                  type="range"
                  min={UZS_MIN}
                  max={UZS_MAX}
                  step={UZS_STEP}
                  value={durationValue}
                  onChange={(e) =>
                    updateDraft({ durationUzs: Number(e.target.value) })
                  }
                  aria-valuemin={UZS_MIN}
                  aria-valuemax={UZS_MAX}
                  aria-valuenow={durationValue}
                  aria-label="Donat davomiyligi"
                />
              </div>
            </div>

            <div className={cn.toggleRow}>
              <p className={cn.toggleLabel}>{`Summani ko'rsatish`}</p>
              <button
                type="button"
                role="switch"
                aria-checked={settings.showAmount}
                className={classNames(
                  cn.switch,
                  settings.showAmount ? cn.switchActive : cn.switchIdle,
                )}
                onClick={() =>
                  updateDraft({ showAmount: !settings.showAmount })
                }
              >
                <span className={cn.switchKnob} />
              </button>
            </div>
          </section>

          <section className={cn.blockCard}>
            <h2 className={cn.sectionTitle}>Animatsiyani tanlang</h2>
            <div className={cn.animationGrid}>
              {ANIMATION_OPTIONS.map((opt) => (
                <div key={opt.id} className={cn.animationCell}>
                  <button
                    type="button"
                    className={classNames(
                      cn.animationSelect,
                      settings.selectedAnimationId === opt.id &&
                        cn.animationSelectSelected,
                    )}
                    onClick={() => updateDraft({ selectedAnimationId: opt.id })}
                  >
                    Tanlash
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className={cn.saveFooter}>
            <button
              type="button"
              className={cn.saveButton}
              disabled={
                saveMutation.isPending || readFundraisingPageMode() === 'error'
              }
              onClick={() => saveMutation.mutate(settings)}
            >
              {saveMutation.isPending ? 'Saqlanmoqda…' : 'Saqlash'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
