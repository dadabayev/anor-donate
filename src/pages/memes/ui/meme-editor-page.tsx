import cn from './meme-editor-page.module.css'

import {
  fetchMemeEditorData,
  fetchReadyMemes,
  saveMeme,
} from '../api/memes-api'
import { memeFormSchema, type MemeFormValues } from '../model/meme-form.schema'
import {
  type MemeItem,
  MEMES_BACK_ACTION,
  MEMES_EDITOR_SUBTITLE,
  MEMES_PICK_FILE_ACTION,
  MEMES_SAVE_ACTION,
  MEMES_SETTINGS_SUBTITLE,
} from '../model/memes'
import {
  type MemeEditorTab,
  MemeSelectionModal,
  ReadyMemesTab,
  TabSwitch,
} from './components'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

const PRICE_SLIDER_MIN = 1_000
const PRICE_SLIDER_MAX = 200_000

const formatAmountGrouped = (value: number) => {
  const rounded = String(Math.max(0, Math.round(value)))
  const groups: string[] = []

  for (let index = rounded.length; index > 0; index -= 3) {
    const start = Math.max(index - 3, 0)
    groups.unshift(rounded.slice(start, index))
  }

  return groups.join(' ')
}

const DEFAULT_VALUES: MemeFormValues = {
  category: 'Game',
  name: 'Genshin',
  priceUzs: 25_000,
  removeGreenScreen: false,
  selectedReadyMemeId: '',
  videoFileName: '',
  volumePercent: 25,
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const MemeEditorPage = () => {
  const navigate = useNavigate()
  const { memeId } = useParams<{ memeId?: string }>()
  const isEditMode = Boolean(memeId)
  const [activeTab, setActiveTab] = useState<MemeEditorTab>('own')
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedReadyMemeId, setSelectedReadyMemeId] = useState<string | null>(
    null,
  )
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const editorQuery = useQuery({
    queryKey: ['meme-editor', memeId ?? 'create'],
    queryFn: () => fetchMemeEditorData(memeId),
  })

  const readyMemesQuery = useQuery({
    queryKey: ['ready-memes-list'],
    queryFn: fetchReadyMemes,
    enabled: activeTab === 'ready' || isModalOpen,
  })

  const initialValues = useMemo(() => {
    const meme = editorQuery.data?.meme
    if (!meme) {
      return DEFAULT_VALUES
    }

    return {
      category: meme.category,
      name: meme.name,
      priceUzs: meme.priceUzs,
      removeGreenScreen: false,
      selectedReadyMemeId: '',
      videoFileName: '',
      volumePercent: meme.volumePercent,
    }
  }, [editorQuery.data?.meme])

  const { register, control, handleSubmit, setValue, formState } =
    useForm<MemeFormValues>({
      defaultValues: initialValues,
      values: initialValues,
      resolver: zodResolver(memeFormSchema),
      mode: 'onTouched',
    })
  const { errors, isDirty } = formState

  const mutation = useMutation({
    mutationFn: (values: MemeFormValues) => saveMeme(values, memeId),
    onSuccess: () => {
      setStatusMessage('Muvaffaqiyatli saqlandi')
      window.setTimeout(() => {
        void navigate('/memes')
      }, 450)
    },
    onError: () => {
      setStatusMessage('Saqlashda xatolik yuz berdi')
    },
  })

  const readyMemes = readyMemesQuery.data ?? editorQuery.data?.readyMemes ?? []
  const watchedPrice = useWatch({ control, name: 'priceUzs' })
  const watchedVolume = useWatch({ control, name: 'volumePercent' })
  const watchedFileName = useWatch({ control, name: 'videoFileName' })

  const priceSliderFillPercent =
    ((watchedPrice - PRICE_SLIDER_MIN) /
      (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
    100
  const volumeSliderFillPercent = watchedVolume

  const handleFilePick = (file: File | null) => {
    setValue('videoFileName', file?.name ?? '', {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const handleOpenSelectionModal = (meme: MemeItem) => {
    setSelectedReadyMemeId(meme.id)
    setValue('priceUzs', meme.priceUzs, { shouldDirty: true })
    setValue('volumePercent', meme.volumePercent, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setModalOpen(true)
  }

  const handleModalConfirm = () => {
    if (!selectedReadyMemeId) {
      return
    }

    const selectedMeme = readyMemes.find(
      (meme) => meme.id === selectedReadyMemeId,
    )
    if (!selectedMeme) {
      return
    }

    setValue('selectedReadyMemeId', selectedReadyMemeId, { shouldDirty: true })
    setValue('category', selectedMeme.category, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('name', selectedMeme.name, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('priceUzs', selectedMeme.priceUzs, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('volumePercent', selectedMeme.volumePercent, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setActiveTab('own')
    setModalOpen(false)
  }

  const onSubmit = handleSubmit((values) => {
    if (mutation.isPending) {
      return
    }

    setStatusMessage('')
    mutation.mutate(values)
  })

  if (editorQuery.isLoading) {
    return (
      <section className={cn.page}>
        <div className={cn.column}>
          <h1 className={cn.title}>Memlar</h1>
          <p className={cn.subtitle}>{MEMES_EDITOR_SUBTITLE}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <h1 className={cn.title}>Memlar</h1>
        <p className={cn.subtitle}>
          {isEditMode ? MEMES_SETTINGS_SUBTITLE : MEMES_EDITOR_SUBTITLE}
        </p>

        <div className={cn.toolbarRow}>
          <Link to="/memes" className={cn.backButton}>
            <IconArrowLeft size={20} />
            {MEMES_BACK_ACTION}
          </Link>
        </div>

        <div className={cn.tabsRow}>
          <TabSwitch activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === 'ready' ? (
          <ReadyMemesTab
            memes={readyMemes}
            isLoading={readyMemesQuery.isLoading}
            error={readyMemesQuery.isError ? 'Tayyor memlar yuklanmadi' : null}
            onSelect={handleOpenSelectionModal}
          />
        ) : (
          <form className={cn.formCard} onSubmit={onSubmit} noValidate>
            <h2 className={cn.sectionTitle}>Yangi mem yuklash</h2>

            <div className={cn.formGrid}>
              <div className={classNames(cn.field, cn.fieldSelect)}>
                <label className={cn.fieldLabel} htmlFor="category">
                  Kategoriya
                </label>
                <span className={cn.selectShell}>
                  <select
                    id="category"
                    className={cn.select}
                    {...register('category')}
                  >
                    {(editorQuery.data?.categories ?? ['Game']).map(
                      (category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                  <IconChevronDown
                    className={cn.selectChevron}
                    size={24}
                    stroke={2}
                  />
                </span>
                {errors.category ? (
                  <p className={cn.errorText}>{errors.category.message}</p>
                ) : null}
              </div>

              <div className={cn.field}>
                <label className={cn.fieldLabel} htmlFor="name">
                  Nomi
                </label>
                <span className={cn.inputShell}>
                  <input
                    id="name"
                    className={cn.inputInner}
                    type="text"
                    {...register('name')}
                  />
                </span>
                {errors.name ? (
                  <p className={cn.errorText}>{errors.name.message}</p>
                ) : null}
              </div>
            </div>

            <div className={cn.uploadRow}>
              <div>
                <h3 className={cn.sectionTitle}>Video yuklash</h3>
                <div className={cn.uploadBox}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className={cn.uploadInput}
                    onChange={(event) =>
                      handleFilePick(event.target.files?.[0] ?? null)
                    }
                  />
                  <button
                    type="button"
                    className={cn.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {MEMES_PICK_FILE_ACTION}
                  </button>
                </div>
                {watchedFileName ? (
                  <p className={cn.status}>{watchedFileName}</p>
                ) : null}
              </div>

              <div className={cn.uploadColRight}>
                <label className={cn.sliderField}>
                  <span className={cn.fieldLabel}>Narx</span>
                  <div className={cn.sliderShell}>
                    <div className={cn.sliderValue}>
                      <span>{formatAmountGrouped(watchedPrice)}</span>
                      <small>UZS</small>
                    </div>
                    <div className={cn.sliderTrack}>
                      <span className={cn.sliderRail} aria-hidden="true">
                        <span
                          className={cn.sliderFill}
                          style={{ width: `${priceSliderFillPercent}%` }}
                        />
                      </span>
                      <input
                        className={cn.slider}
                        type="range"
                        min={PRICE_SLIDER_MIN}
                        max={PRICE_SLIDER_MAX}
                        step={1_000}
                        value={watchedPrice}
                        onChange={(event) =>
                          setValue('priceUzs', Number(event.target.value), {
                            shouldDirty: true,
                          })
                        }
                      />
                    </div>
                  </div>
                </label>

                <label className={cn.checkboxRow}>
                  <input
                    type="checkbox"
                    {...register('removeGreenScreen')}
                    className={cn.checkboxInput}
                  />
                  <span>Yashil fonni olib tashlash (Green Screen)</span>
                </label>

                <label className={cn.sliderField}>
                  <span className={cn.fieldLabel}>Tovush balandligi</span>
                  <div className={cn.sliderShell}>
                    <div className={cn.sliderValue}>
                      <span>{watchedVolume}</span>
                      <small>%</small>
                    </div>
                    <div className={cn.sliderTrack}>
                      <span className={cn.sliderRail} aria-hidden="true">
                        <span
                          className={cn.sliderFill}
                          style={{ width: `${volumeSliderFillPercent}%` }}
                        />
                      </span>
                      <input
                        className={cn.slider}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={watchedVolume}
                        onChange={(event) =>
                          setValue(
                            'volumePercent',
                            Number(event.target.value),
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          )
                        }
                      />
                    </div>
                  </div>
                </label>

                <div className={cn.uploadColRightFooter}>
                  <button
                    type="submit"
                    className={cn.saveButton}
                    disabled={mutation.isPending || (isEditMode && !isDirty)}
                  >
                    {mutation.isPending ? 'Saqlanmoqda...' : MEMES_SAVE_ACTION}
                  </button>
                </div>
              </div>
            </div>

            {statusMessage ? (
              <p className={mutation.isError ? cn.errorText : cn.status}>
                {statusMessage}
              </p>
            ) : null}
          </form>
        )}
      </div>

      <MemeSelectionModal
        isOpen={isModalOpen}
        error={readyMemesQuery.isError ? 'Tayyor memlar yuklanmadi' : null}
        isLoading={readyMemesQuery.isLoading}
        memes={readyMemes}
        selectedMemeId={selectedReadyMemeId}
        priceUzs={watchedPrice}
        volumePercent={watchedVolume}
        onPriceChange={(value) =>
          setValue('priceUzs', value, { shouldDirty: true })
        }
        onVolumeChange={(value) =>
          setValue('volumePercent', value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </section>
  )
}
