import { buildWaveformBars } from './waveform'
import { useEffect, useState } from 'react'

interface UseAudioWaveformOptions {
  barCount?: number
  maxHeight?: number
  minHeight?: number
  src?: string | null
}

const DEFAULT_BAR_COUNT = 32
const DEFAULT_MIN_HEIGHT = 6
const DEFAULT_MAX_HEIGHT = 100

const createFallbackBars = (barCount: number, minHeight: number) =>
  Array.from({ length: barCount }, () => minHeight)

const decodeBarsFromAudioSource = async ({
  barCount,
  maxHeight,
  minHeight,
  src,
}: {
  barCount: number
  maxHeight: number
  minHeight: number
  src: string
}) => {
  const response = await fetch(src)
  const audioBufferBytes = await response.arrayBuffer()

  const AudioContextConstructor =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext
      }
    ).webkitAudioContext

  if (!AudioContextConstructor) {
    return createFallbackBars(barCount, minHeight)
  }

  const audioContext = new AudioContextConstructor()

  try {
    const decodedBuffer = await audioContext.decodeAudioData(audioBufferBytes)
    const channelData = decodedBuffer.getChannelData(0)

    return buildWaveformBars(channelData, {
      barCount,
      maxHeight,
      minHeight,
    })
  } finally {
    await audioContext.close()
  }
}

export const useAudioWaveform = ({
  barCount = DEFAULT_BAR_COUNT,
  maxHeight = DEFAULT_MAX_HEIGHT,
  minHeight = DEFAULT_MIN_HEIGHT,
  src,
}: Readonly<UseAudioWaveformOptions>) => {
  const [bars, setBars] = useState<number[]>(
    createFallbackBars(barCount, minHeight),
  )

  useEffect(() => {
    if (!src) {
      return
    }

    let isCancelled = false

    void decodeBarsFromAudioSource({
      barCount,
      maxHeight,
      minHeight,
      src,
    })
      .then((nextBars) => {
        if (!isCancelled) {
          setBars(nextBars)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setBars(createFallbackBars(barCount, minHeight))
        }
      })

    return () => {
      isCancelled = true
    }
  }, [barCount, maxHeight, minHeight, src])

  return src ? bars : createFallbackBars(barCount, minHeight)
}
