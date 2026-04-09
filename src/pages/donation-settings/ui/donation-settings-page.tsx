import cn from './donation-settings-page.module.css'

import { IconFile, IconLink, IconX } from '@tabler/icons-react'
import classNames from 'classnames'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DEFAULT_LINK = 'https://anordonate.uz/examplelink'

const truncateFileName = (name: string, max = 56) => {
  if (name.length <= max) {
    return name
  }
  return `${name.slice(0, 28)}…${name.slice(-24)}`
}

const formatAmount = (value: number) => {
  const digits = String(Math.round(value))
  const parts: string[] = []
  for (let i = digits.length; i > 0; i -= 3) {
    const start = Math.max(0, i - 3)
    parts.unshift(digits.slice(start, i))
  }
  return parts.join(' ')
}

const AmountSlider = ({
  label,
  value,
  onChange,
  max,
  suffix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  max: number
  suffix: string
}) => {
  const fieldId = useId()
  const fillPct = max > 0 ? (value / max) * 100 : 0

  return (
    <div className={cn.field}>
      <label className={cn.fieldLabel} htmlFor={fieldId}>
        {label}
      </label>
      <div className={cn.amountBlock}>
        <div className={cn.amountInput}>
          <span className={cn.amountValue}>{formatAmount(value)}</span>
          <span className={cn.amountSuffix}>{suffix}</span>
        </div>
        <div className={cn.sliderTrack}>
          <div className={cn.sliderRail}>
            <span className={cn.sliderFill} style={{ width: `${fillPct}%` }} />
          </div>
          <input
            id={fieldId}
            className={cn.slider}
            type="range"
            min={0}
            max={max}
            step={max > 100 ? 50_000 : 1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
          />
        </div>
      </div>
    </div>
  )
}

const Toggle = ({
  checked,
  onChange,
  labelledBy,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  labelledBy: string
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    className={classNames(cn.toggle, checked ? cn.toggleOn : cn.toggleOff)}
    onClick={() => onChange(!checked)}
  >
    <span className={cn.knob} aria-hidden />
  </button>
)

export const DonationSettingsPage = () => {
  const { t } = useTranslation()
  const uploadFieldId = useId()
  const [donationLink, setDonationLink] = useState(DEFAULT_LINK)
  const [minTextAmount, setMinTextAmount] = useState(1_000_000)
  const [minVoiceAmount, setMinVoiceAmount] = useState(1_000_000)
  const [voiceMessageOn, setVoiceMessageOn] = useState(true)
  const [pageText, setPageText] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [buttonColor, setButtonColor] = useState('#8b0037')
  const [buttonTextColor, setButtonTextColor] = useState('#8b0037')
  const [blurPercent, setBlurPercent] = useState(25)
  const [standardFilterOn, setStandardFilterOn] = useState(true)
  const [banInput, setBanInput] = useState('')
  const [bannedWords, setBannedWords] = useState<string[]>(() =>
    Array.from({ length: 6 }, () => 'Ban'),
  )
  const banDisplay = useCallback(
    (word: string) =>
      word === 'Ban' ? t('donationSettings.banDefault') : word,
    [t],
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const previewObjectUrlRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const revokePreviewUrl = useCallback(() => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }
    setImagePreviewUrl(null)
  }, [])

  const applySelectedFile = useCallback(
    (file: File | undefined) => {
      revokePreviewUrl()
      if (!file) {
        setUploadedFile(null)
        return
      }
      setUploadedFile(file)
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        previewObjectUrlRef.current = url
        setImagePreviewUrl(url)
      }
    },
    [revokePreviewUrl],
  )

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(donationLink)
    } catch {
      /* ignore */
    }
  }, [donationLink])

  const addBannedWord = useCallback(() => {
    const word = banInput.trim()
    if (!word) {
      return
    }
    setBannedWords((prev) => [...prev, word])
    setBanInput('')
  }, [banInput])

  const removeBannedWord = useCallback((index: number) => {
    setBannedWords((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearUploadedFile = useCallback(() => {
    revokePreviewUrl()
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [revokePreviewUrl])

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <h1 className={cn.title}>{t('donationSettings.pageTitle')}</h1>

        <div className={cn.linkBlock}>
          <p className={cn.linkLabel}>
            {t('donationSettings.linkForDonation')}
          </p>
          <div className={cn.linkRow}>
            <div className={cn.linkInputWrap}>
              <input
                className={cn.linkInput}
                type="url"
                value={donationLink}
                onChange={(e) => setDonationLink(e.target.value)}
                aria-label={t('donationSettings.linkInputAria')}
              />
            </div>
            <button
              type="button"
              className={cn.linkCopy}
              onClick={copyLink}
              aria-label={t('donationSettings.copyLinkAria')}
            >
              <IconLink size={22} stroke={2} />
            </button>
          </div>
        </div>

        <div className={cn.cardsGrid}>
          <article className={cn.card}>
            <h2 className={cn.cardTitle}>{t('donationSettings.minAmounts')}</h2>
            <AmountSlider
              label={t('donationSettings.minTextDonation')}
              value={minTextAmount}
              onChange={setMinTextAmount}
              max={10_000_000}
              suffix={t('common.currencyUzs')}
            />
            <AmountSlider
              label={t('donationSettings.minVoiceDonation')}
              value={minVoiceAmount}
              onChange={setMinVoiceAmount}
              max={10_000_000}
              suffix={t('common.currencyUzs')}
            />
            <div className={cn.toggleRow}>
              <span className={cn.toggleLabel} id="voice-toggle-label">
                {t('donationSettings.voiceMessage')}
              </span>
              <Toggle
                labelledBy="voice-toggle-label"
                checked={voiceMessageOn}
                onChange={setVoiceMessageOn}
              />
            </div>
          </article>

          <article className={cn.card}>
            <h2 className={cn.cardTitle}>
              {t('donationSettings.textDonationSettings')}
            </h2>
            <div className={cn.field}>
              <label className={cn.fieldLabel} htmlFor="page-text">
                {t('donationSettings.pageText')}
              </label>
              <textarea
                id="page-text"
                className={`${cn.inputMuted} ${cn.textarea}`}
                value={pageText}
                onChange={(e) => setPageText(e.target.value)}
                rows={5}
              />
            </div>
            <div className={cn.field}>
              <label className={cn.fieldLabel} htmlFor="btn-text">
                {t('donationSettings.buttonText')}
              </label>
              <input
                id="btn-text"
                className={`${cn.inputMuted} ${cn.inputSingle}`}
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
            </div>
          </article>

          <article className={cn.card}>
            <h2 className={cn.cardTitle}>
              {t('donationSettings.colorSettings')}
            </h2>
            <div className={cn.colorRow}>
              <input
                className={cn.swatch}
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                aria-label={t('donationSettings.buttonColorAria')}
              />
              <div className={cn.colorMeta}>
                <p className={cn.colorName}>
                  {t('donationSettings.buttonColor')}
                </p>
                <p className={cn.colorHex}>{buttonColor.toUpperCase()}</p>
              </div>
            </div>
            <div className={cn.colorRow}>
              <input
                className={cn.swatch}
                type="color"
                value={buttonTextColor}
                onChange={(e) => setButtonTextColor(e.target.value)}
                aria-label={t('donationSettings.buttonTextColorAria')}
              />
              <div className={cn.colorMeta}>
                <p className={cn.colorName}>
                  {t('donationSettings.buttonTextColor')}
                </p>
                <p className={cn.colorHex}>{buttonTextColor.toUpperCase()}</p>
              </div>
            </div>
            <AmountSlider
              label={t('donationSettings.blurBackground')}
              value={blurPercent}
              onChange={setBlurPercent}
              max={100}
              suffix={t('common.percent')}
            />
          </article>

          <article className={cn.card}>
            <h2 className={cn.cardTitle}>
              {t('donationSettings.extraSettings')}
            </h2>
            <div className={cn.toggleRow}>
              <span className={cn.toggleLabel} id="filter-toggle-label">
                {t('donationSettings.standardFilter')}
              </span>
              <Toggle
                labelledBy="filter-toggle-label"
                checked={standardFilterOn}
                onChange={setStandardFilterOn}
              />
            </div>
            <div className={cn.uploadZone}>
              <input
                id={uploadFieldId}
                ref={fileInputRef}
                className={cn.uploadInputHidden}
                type="file"
                aria-label={t('donationSettings.uploadFileAria')}
                onChange={(e) => {
                  applySelectedFile(e.target.files?.[0])
                }}
              />
              <div className={cn.uploadInner}>
                {uploadedFile ? (
                  <>
                    <div className={cn.previewBox} title={uploadedFile.name}>
                      {imagePreviewUrl ? (
                        <img
                          className={cn.previewImage}
                          src={imagePreviewUrl}
                          alt={uploadedFile.name}
                        />
                      ) : (
                        <div className={cn.previewFileFallback}>
                          <IconFile
                            className={cn.previewFileIcon}
                            size={40}
                            stroke={1.5}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        className={cn.previewRemove}
                        onClick={clearUploadedFile}
                        aria-label={t('donationSettings.removeFileAria')}
                      >
                        <IconX size={16} stroke={2.5} />
                      </button>
                    </div>
                    <p className={cn.uploadFileName} title={uploadedFile.name}>
                      {truncateFileName(uploadedFile.name)}
                    </p>
                    <label
                      htmlFor={uploadFieldId}
                      className={cn.uploadBtnLabel}
                    >
                      <span className={cn.uploadBtn}>
                        {t('donationSettings.chooseFile')}
                      </span>
                    </label>
                  </>
                ) : (
                  <label htmlFor={uploadFieldId} className={cn.uploadBtnLabel}>
                    <span className={cn.uploadBtn}>
                      {t('donationSettings.chooseFile')}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </article>
        </div>

        <article className={`${cn.card} ${cn.banCard}`}>
          <h2 className={cn.cardTitle}>{t('donationSettings.addWord')}</h2>
          <p className={cn.fieldLabel}>{t('donationSettings.wordLabel')}</p>
          <div className={cn.wordInputRow}>
            <input
              className={cn.wordInput}
              type="text"
              value={banInput}
              onChange={(e) => setBanInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addBannedWord()
                }
              }}
              placeholder={t('donationSettings.wordPlaceholder')}
              aria-label={t('donationSettings.bannedWordAria')}
            />
            <button
              type="button"
              className={cn.addWordBtn}
              onClick={addBannedWord}
            >
              {t('donationSettings.addWordButton')}
            </button>
          </div>
          <div className={cn.chips}>
            {bannedWords.map((word, index) => (
              <div key={`ban-chip-${index}`} className={cn.chip}>
                <span className={cn.chipText}>{banDisplay(word)}</span>
                <button
                  type="button"
                  className={cn.chipRemove}
                  onClick={() => removeBannedWord(index)}
                  aria-label={t('donationSettings.removeWordAria', {
                    word: banDisplay(word),
                  })}
                >
                  <span className={cn.chipRemoveInner}>
                    <IconX size={12} stroke={2.5} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        </article>

        <div className={cn.saveWrap}>
          <button type="button" className={cn.saveBtn}>
            {t('donationSettings.save')}
          </button>
        </div>
      </div>
    </section>
  )
}
