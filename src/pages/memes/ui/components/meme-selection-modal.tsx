import cn from '../meme-editor-page.module.css'

import type { MemeItem } from '../../model/memes'
import { MEMES_MODAL_SAVE, MEMES_SELECTION_TITLE } from '../../model/memes'
import { Modal } from '@shared/ui'

interface MemeSelectionModalProps {
  error: string | null
  isLoading: boolean
  isOpen: boolean
  memes: MemeItem[]
  priceUzs: number
  selectedMemeId: string | null
  volumePercent: number
  onClose: () => void
  onConfirm: () => void
  onPriceChange: (price: number) => void
  onVolumeChange: (volume: number) => void
}

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

export const MemeSelectionModal = ({
  error,
  isLoading,
  isOpen,
  memes,
  priceUzs,
  selectedMemeId,
  volumePercent,
  onClose,
  onConfirm,
  onPriceChange,
  onVolumeChange,
}: Readonly<MemeSelectionModalProps>) => {
  const selectedMeme = memes.find((item) => item.id === selectedMemeId) ?? null

  const priceFillPercent =
    ((priceUzs - PRICE_SLIDER_MIN) / (PRICE_SLIDER_MAX - PRICE_SLIDER_MIN)) *
    100

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      title={MEMES_SELECTION_TITLE}
    >
      {isLoading ? (
        <div className={cn.centerState}>Yuklanmoqda...</div>
      ) : error ? (
        <div className={cn.centerState}>
          <p className={cn.errorText}>{error}</p>
        </div>
      ) : memes.length === 0 ? (
        <div className={cn.centerState}>
          <p className={cn.emptyText}>Tanlash uchun mem topilmadi</p>
        </div>
      ) : selectedMeme ? (
        <div className={cn.selectionModalRoot}>
          <div className={cn.selectionLayout}>
            <div className={cn.selectionPreview}>
              <img src={selectedMeme.imageUrl} alt="" />
            </div>

            <div className={cn.selectionMeta}>
              <div className={cn.selectionValues}>
                <div className={cn.selectionField}>
                  <span className={cn.fieldLabel}>Kategoriya</span>
                  <strong>{selectedMeme.category}</strong>
                </div>
                <div className={cn.selectionField}>
                  <span className={cn.fieldLabel}>Nomi</span>
                  <strong>{selectedMeme.name}</strong>
                </div>
              </div>

              <div className={cn.selectionSliders}>
                <label className={cn.sliderField}>
                  <span className={cn.fieldLabel}>Narx kiriting</span>
                  <div className={cn.sliderShell}>
                    <div className={cn.sliderValue}>
                      <span>{formatAmountGrouped(priceUzs)}</span>
                      <small>UZS</small>
                    </div>
                    <div className={cn.sliderTrack}>
                      <span className={cn.sliderRail} aria-hidden="true">
                        <span
                          className={cn.sliderFill}
                          style={{ width: `${priceFillPercent}%` }}
                        />
                      </span>
                      <input
                        className={cn.slider}
                        type="range"
                        min={PRICE_SLIDER_MIN}
                        max={PRICE_SLIDER_MAX}
                        step={1_000}
                        value={priceUzs}
                        onChange={(event) =>
                          onPriceChange(Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                </label>

                <label className={cn.sliderField}>
                  <span className={cn.fieldLabel}>Tovush balandligi</span>
                  <div className={cn.sliderShell}>
                    <div className={cn.sliderValue}>
                      <span>{volumePercent}</span>
                      <small>%</small>
                    </div>
                    <div className={cn.sliderTrack}>
                      <span className={cn.sliderRail} aria-hidden="true">
                        <span
                          className={cn.sliderFill}
                          style={{ width: `${volumePercent}%` }}
                        />
                      </span>
                      <input
                        className={cn.slider}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={volumePercent}
                        onChange={(event) =>
                          onVolumeChange(Number(event.target.value))
                        }
                      />
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="button"
                className={cn.modalSaveButton}
                disabled={!selectedMemeId}
                onClick={onConfirm}
              >
                {MEMES_MODAL_SAVE}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn.centerState}>
          <p className={cn.emptyText}>Mem tanlang</p>
        </div>
      )}
    </Modal>
  )
}
