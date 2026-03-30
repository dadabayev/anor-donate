import cn from './widget-editor-page.module.css'

import {
  createWidgetDraft,
  createWidgetFormValues,
  findWidgetById,
  loadWidgetsDashboard,
  WIDGET_FONT_OPTIONS,
  WIDGET_VOICE_OPTIONS,
  WIDGET_WAVEFORM,
  type WidgetFormValues,
  WIDGETS_CREATE_PAGE_SUBTITLE,
  WIDGETS_EDIT_PAGE_SUBTITLE,
  WIDGETS_ERROR_TEXT,
  WIDGETS_ERROR_TITLE,
  WIDGETS_PAGE_TITLE,
  WIDGETS_RETRY_ACTION,
} from '../model/widgets'
import { WidgetsLoading, WidgetsState } from './components'
import { ASSETS } from '@shared/constants'
import {
  IconArrowLeft,
  IconChevronDown,
  IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useId, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

type EditorMode = 'create' | 'edit'

const formatAmount = (value: number) => {
  const rounded = String(Math.max(0, Math.round(value)))
  const groups: string[] = []

  for (let index = rounded.length; index > 0; index -= 3) {
    const start = Math.max(index - 3, 0)
    groups.unshift(rounded.slice(start, index))
  }

  return groups.join(' ')
}

interface SliderFieldProps {
  disabled?: boolean
  id: string
  label: string
  max: number
  min: number
  suffix: string
  value: number
  onChange: (nextValue: number) => void
}

const SliderField = ({
  disabled,
  id,
  label,
  max,
  min,
  suffix,
  value,
  onChange,
}: Readonly<SliderFieldProps>) => {
  const fillPercent = ((value - min) / (max - min)) * 100
  const displayValue = suffix === 'UZS' ? formatAmount(value) : String(value)

  return (
    <label className={cn.field} htmlFor={id}>
      <span className={cn.fieldLabel}>{label}</span>
      <div className={cn.sliderShell}>
        <div className={cn.sliderValue}>
          <span>{displayValue}</span>
          <small>{suffix}</small>
        </div>
        <div className={cn.sliderTrack}>
          <span className={cn.sliderRail} aria-hidden="true">
            <span
              className={cn.sliderFill}
              style={{ width: `${fillPercent}%` }}
            />
          </span>
          <input
            id={id}
            className={cn.slider}
            type="range"
            min={min}
            max={max}
            step={suffix === 'UZS' ? 5_000 : 1}
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(Number(event.target.value))}
          />
        </div>
      </div>
    </label>
  )
}

interface SelectFieldProps {
  disabled?: boolean
  id: string
  label: string
  options: readonly string[]
  value: string
  onChange: (nextValue: string) => void
}

const SelectField = ({
  disabled,
  id,
  label,
  options,
  value,
  onChange,
}: Readonly<SelectFieldProps>) => (
  <label className={classNames(cn.field, cn.fieldSelect)} htmlFor={id}>
    <span className={cn.fieldLabel}>{label}</span>
    <span className={cn.selectShell}>
      <select
        id={id}
        className={cn.select}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <IconChevronDown className={cn.selectChevron} size={24} stroke={2} />
    </span>
  </label>
)

interface ColorFieldProps {
  disabled?: boolean
  id: string
  label: string
  value: string
  onChange: (nextValue: string) => void
}

const ColorField = ({
  disabled,
  id,
  label,
  value,
  onChange,
}: Readonly<ColorFieldProps>) => (
  <label className={cn.colorField} htmlFor={id}>
    <input
      id={id}
      className={cn.colorInput}
      type="color"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
    />
    <span className={cn.colorMeta}>
      <strong>{label}</strong>
      <small>{value.toUpperCase()}</small>
    </span>
  </label>
)

const UploadPlaceholder = ({
  accept,
  buttonText,
  disabled,
  fileName,
  inputId,
  label,
  onFileSelect,
}: {
  accept?: string
  buttonText: string
  disabled?: boolean
  fileName: string
  inputId: string
  label: string
  onFileSelect: (fileName: string) => void
}) => (
  <section className={cn.uploadSection}>
    <h2 className={cn.uploadTitle}>{label}</h2>
    <div className={cn.uploadZone}>
      <input
        id={inputId}
        className={cn.uploadInput}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => onFileSelect(event.target.files?.[0]?.name ?? '')}
      />
      <label
        htmlFor={inputId}
        className={classNames(
          cn.uploadButton,
          disabled && cn.uploadButtonDisabled,
        )}
      >
        {buttonText}
      </label>
      {fileName ? <p className={cn.uploadFileName}>{fileName}</p> : null}
    </div>
  </section>
)

interface AudioPreviewProps {
  disabled?: boolean
  fileName: string
  inputId: string
  onFileSelect: (fileName: string) => void
}

const AudioPreview = ({
  disabled,
  fileName,
  inputId,
  onFileSelect,
}: Readonly<AudioPreviewProps>) => (
  <section className={cn.uploadSection}>
    <h2 className={cn.uploadTitle}>Audio faylni yuklash</h2>
    <div className={cn.audioZone}>
      <div className={cn.audioPlayColumn}>
        <button type="button" className={cn.audioPlay} disabled={disabled}>
          <IconPlayerPlayFilled size={18} />
        </button>
      </div>
      <div className={cn.audioBody}>
        <div className={cn.audioWaveRow}>
          <span className={cn.audioTime}>00:00</span>
          <div className={cn.waveform} aria-hidden="true">
            {WIDGET_WAVEFORM.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={cn.waveBar}
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
          <span className={cn.audioTime}>00:00</span>
        </div>
        <label
          htmlFor={inputId}
          className={classNames(
            cn.uploadButton,
            disabled && cn.uploadButtonDisabled,
          )}
        >
          Faylni tanlash
        </label>
        {fileName ? <p className={cn.uploadFileName}>{fileName}</p> : null}
      </div>
      <input
        id={inputId}
        className={cn.uploadInput}
        type="file"
        accept="audio/*"
        disabled={disabled}
        onChange={(event) => onFileSelect(event.target.files?.[0]?.name ?? '')}
      />
    </div>
  </section>
)

interface WidgetEditorFormProps {
  mode: EditorMode
  initialValues: WidgetFormValues
  isSaving: boolean
  onSubmit: (formValues: WidgetFormValues) => void
}

const WidgetEditorForm = ({
  mode,
  initialValues,
  isSaving,
  onSubmit,
}: Readonly<WidgetEditorFormProps>) => {
  const [values, setValues] = useState(initialValues)
  const amountId = useId()
  const volumeId = useId()
  const durationId = useId()
  const voiceId = useId()
  const fontId = useId()
  const autoReadId = useId()
  const nameColorId = useId()
  const textColorId = useId()
  const imageFileId = useId()
  const audioFileId = useId()
  const subtitle =
    mode === 'create'
      ? WIDGETS_CREATE_PAGE_SUBTITLE
      : WIDGETS_EDIT_PAGE_SUBTITLE
  const [imageFileName, setImageFileName] = useState('')
  const [audioFileName, setAudioFileName] = useState('')

  return (
    <section className={cn.page}>
      <header className={cn.header}>
        <h1 className={cn.title}>{WIDGETS_PAGE_TITLE}</h1>
        <p className={cn.subtitle}>{subtitle}</p>
        <Link className={cn.backButton} to="/widgets">
          <IconArrowLeft size={18} />
          <span>Orqaga qaytarish</span>
        </Link>
      </header>

      <form
        className={cn.formCard}
        aria-busy={isSaving}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(values)
        }}
      >
        <SliderField
          id={amountId}
          label="Dan katta yoki teng miqdor"
          min={0}
          max={500_000}
          suffix="UZS"
          value={values.minimumAmount}
          disabled={isSaving}
          onChange={(minimumAmount) => setValues({ ...values, minimumAmount })}
        />

        <div className={cn.fieldGrid}>
          <SliderField
            id={volumeId}
            label="Tovush balandligi"
            min={0}
            max={100}
            suffix="%"
            value={values.volumePercent}
            disabled={isSaving}
            onChange={(volumePercent) =>
              setValues({ ...values, volumePercent })
            }
          />
          <SliderField
            id={durationId}
            label="Donat davomiyligi"
            min={1}
            max={15}
            suffix="S"
            value={values.durationSeconds}
            disabled={isSaving}
            onChange={(durationSeconds) =>
              setValues({ ...values, durationSeconds })
            }
          />
        </div>

        <div className={cn.fieldGrid}>
          <SelectField
            id={voiceId}
            label="Ovoz ohangi"
            value={values.voiceTone}
            options={WIDGET_VOICE_OPTIONS}
            disabled={isSaving}
            onChange={(voiceTone) => setValues({ ...values, voiceTone })}
          />
          <SelectField
            id={fontId}
            label="Shrift"
            value={values.fontFamily}
            options={WIDGET_FONT_OPTIONS}
            disabled={isSaving}
            onChange={(fontFamily) => setValues({ ...values, fontFamily })}
          />
        </div>

        <div className={cn.toggleRow}>
          <span id={autoReadId} className={cn.toggleLabel}>
            Xabarni avto o&apos;qish
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={values.autoReadMessage}
            aria-labelledby={autoReadId}
            className={classNames(
              cn.toggle,
              values.autoReadMessage ? cn.toggleOn : cn.toggleOff,
            )}
            disabled={isSaving}
            onClick={() =>
              setValues({
                ...values,
                autoReadMessage: !values.autoReadMessage,
              })
            }
          >
            <span className={cn.toggleKnob} />
          </button>
        </div>

        <div className={cn.uploadGrid}>
          <UploadPlaceholder
            inputId={imageFileId}
            label="Gif/Rasmni tanlash"
            buttonText="Faylni tanlash"
            accept="image/*,.gif"
            disabled={isSaving}
            fileName={imageFileName}
            onFileSelect={setImageFileName}
          />
          <div className={cn.uploadColumnRight}>
            <AudioPreview
              disabled={isSaving}
              fileName={audioFileName}
              inputId={audioFileId}
              onFileSelect={setAudioFileName}
            />
            <div className={cn.colorsRow}>
              <ColorField
                id={nameColorId}
                label="Ism rangi"
                value={values.nameColor}
                disabled={isSaving}
                onChange={(nameColor) => setValues({ ...values, nameColor })}
              />
              <ColorField
                id={textColorId}
                label="Matn rangi"
                value={values.textColor}
                disabled={isSaving}
                onChange={(textColor) => setValues({ ...values, textColor })}
              />
            </div>
          </div>
        </div>
      </form>

      <div className={cn.actions}>
        <button
          type="button"
          className={cn.saveButton}
          disabled={isSaving}
          onClick={() => onSubmit(values)}
        >
          {isSaving ? 'Saqlanmoqda...' : "O'zgarishlarni Saqlash"}
        </button>
      </div>
    </section>
  )
}

export const WidgetEditorPage = () => {
  const navigate = useNavigate()
  const { widgetId } = useParams<{ widgetId?: string }>()
  const mode: EditorMode = widgetId ? 'edit' : 'create'
  const query = useQuery({
    queryKey: ['widgets-page', 'editor'],
    queryFn: loadWidgetsDashboard,
  })
  const [isSaving, setIsSaving] = useState(false)

  const initialValues = useMemo((): WidgetFormValues | null => {
    if (!query.data) {
      return null
    }

    if (mode === 'edit' && widgetId) {
      const selectedWidget = findWidgetById(query.data, widgetId)
      return selectedWidget ? createWidgetFormValues(selectedWidget) : null
    }

    const widgetDraft = createWidgetDraft(query.data.widgets.length + 1)
    return createWidgetFormValues(widgetDraft)
  }, [mode, query.data, widgetId])

  const isWidgetMissing = useMemo(
    () => mode === 'edit' && query.isSuccess && initialValues === null,
    [mode, query.isSuccess, initialValues],
  )

  const handleRetry = () => {
    void query.refetch()
  }

  const handleSave = (_formValues: WidgetFormValues) => {
    if (isSaving) {
      return
    }

    setIsSaving(true)

    window.setTimeout(() => {
      setIsSaving(false)
      void navigate('/widgets')
    }, 500)
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

  if (isWidgetMissing) {
    return (
      <WidgetsState
        title={WIDGETS_PAGE_TITLE}
        stateTitle="Vidjet topilmadi"
        text="Tanlangan vidjet mavjud emas yoki o'chirilgan."
        actionLabel="Vidjetlar sahifasiga qaytish"
        image={ASSETS.DEVELOPMENT}
        onAction={() => {
          void navigate('/widgets')
        }}
      />
    )
  }

  if (!initialValues) {
    return <WidgetsLoading title={WIDGETS_PAGE_TITLE} />
  }

  return (
    <WidgetEditorForm
      key={widgetId ?? 'create'}
      mode={mode}
      initialValues={initialValues}
      isSaving={isSaving}
      onSubmit={handleSave}
    />
  )
}
