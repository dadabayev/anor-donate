import cn from './fundraising-page.module.css'

import {
  FUNDRAISING_PAGE_MODE_KEY,
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
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const UZS_MIN = 0
const UZS_MAX = 100_000
const UZS_STEP = 500

const localeTag = (language: string) => {
  if (language.startsWith('ru')) {
    return 'ru-RU'
  }
  if (language.startsWith('uz')) {
    return 'uz-UZ'
  }
  return 'en-US'
}

const ANIMATION_OPTIONS = [
  { id: 'a' as const, label: '1' },
  { id: 'b' as const, label: '2' },
  { id: 'c' as const, label: '3' },
]

export const FundraisingPage = () => {
  const { t, i18n } = useTranslation()
  const formatUzAmount = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat(localeTag(i18n.language), {
        maximumFractionDigits: 0,
      })
        .format(value)
        .replace(/,/g, ' '),
    [i18n.language],
  )
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
        title: t('fundraising.saved'),
        message: t('fundraising.saveSuccess'),
        color: 'teal',
      })
    },
    onError: () => {
      notifications.show({
        title: t('fundraising.saveError'),
        message: t('fundraising.saveErrorDetail'),
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
      setCopyFeedback(t('fundraising.copyOk'))
    } catch {
      setCopyFeedback(t('fundraising.copyFail'))
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
    return <FundraisingLoading title={t('fundraising.pageTitle')} />
  }

  if (query.isError) {
    return (
      <FundraisingState
        title={t('fundraising.pageTitle')}
        stateTitle={t('fundraising.errorTitle')}
        text={t('fundraising.errorText')}
        actionLabel={t('fundraising.retry')}
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
          <h1 className={cn.title}>{t('fundraising.pageTitle')}</h1>
          <p className={cn.subtitle}>{t('fundraising.pageSubtitle')}</p>
        </header>

        <div className={cn.stack}>
          <section className={cn.linkCard}>
            <h2 className={cn.cardTitle}>{t('fundraising.streamLink')}</h2>
            <div className={cn.linkRow}>
              <div className={cn.linkField}>
                <input
                  className={cn.linkInput}
                  type="url"
                  value={settings.streamLink}
                  onChange={(e) => updateDraft({ streamLink: e.target.value })}
                  aria-label={t('fundraising.streamLink')}
                />
              </div>
              <button
                type="button"
                className={cn.copyButton}
                aria-label={t('fundraising.copyAria')}
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
            <h2 className={cn.sectionTitle}>{t('fundraising.totalTop')}</h2>

            <div className={cn.nameField}>
              <p className={cn.fieldLabel}>{t('fundraising.name')}</p>
              <input
                className={cn.textInput}
                type="text"
                value={settings.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                aria-label={t('fundraising.nameAria')}
              />
            </div>

            <div className={cn.gridTwo}>
              <div className={cn.sliderField}>
                <p className={cn.fieldLabel}>{t('fundraising.volume')}</p>
                <div className={cn.sliderValueRow}>
                  <p className={cn.sliderValue}>
                    {formatUzAmount(volumeValue)}
                  </p>
                  <span className={cn.sliderUnit}>
                    {t('common.currencyUzs')}
                  </span>
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
                  aria-label={t('fundraising.volumeAria')}
                />
              </div>

              <div className={cn.sliderField}>
                <p className={cn.fieldLabel}>{t('fundraising.duration')}</p>
                <div className={cn.sliderValueRow}>
                  <p className={cn.sliderValue}>
                    {formatUzAmount(durationValue)}
                  </p>
                  <span className={cn.sliderUnit}>
                    {t('common.currencyUzs')}
                  </span>
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
                  aria-label={t('fundraising.durationAria')}
                />
              </div>
            </div>

            <div className={cn.toggleRow}>
              <p className={cn.toggleLabel}>{t('fundraising.showAmount')}</p>
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
            <h2 className={cn.sectionTitle}>
              {t('fundraising.pickAnimation')}
            </h2>
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
                    {t('fundraising.select')}
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
              {saveMutation.isPending
                ? t('fundraising.saving')
                : t('fundraising.save')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
