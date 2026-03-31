interface WaveformBarsConfig {
  barCount: number
  maxHeight: number
  minHeight: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const createFallbackBars = (barCount: number, minHeight: number) =>
  Array.from({ length: barCount }, () => minHeight)

export const formatAudioTime = (seconds: number) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = Math.floor(safeSeconds % 60)

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export const buildWaveformBars = (
  channelData: Float32Array,
  { barCount, maxHeight, minHeight }: Readonly<WaveformBarsConfig>,
): number[] => {
  if (barCount <= 0 || channelData.length === 0) {
    return []
  }

  const samplesPerBar = Math.max(1, Math.floor(channelData.length / barCount))
  const peaks: number[] = []

  for (let barIndex = 0; barIndex < barCount; barIndex += 1) {
    const start = barIndex * samplesPerBar
    const end =
      barIndex === barCount - 1
        ? channelData.length
        : Math.min(channelData.length, start + samplesPerBar)

    let peak = 0

    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      peak = Math.max(peak, Math.abs(channelData[sampleIndex]))
    }

    peaks.push(peak)
  }

  const maxPeak = Math.max(...peaks, 0)

  if (maxPeak <= 0) {
    return createFallbackBars(barCount, minHeight)
  }

  return peaks.map((peak) => {
    const normalized = clamp(peak / maxPeak, 0, 1)
    const scaledHeight = minHeight + normalized * (maxHeight - minHeight)
    return Math.round(scaledHeight)
  })
}
