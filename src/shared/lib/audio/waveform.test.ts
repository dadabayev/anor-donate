import { buildWaveformBars, formatAudioTime } from './waveform'
import { describe, expect, it } from 'vitest'

describe('waveform helpers', () => {
  it('formats seconds as mm:ss', () => {
    expect(formatAudioTime(0)).toBe('00:00')
    expect(formatAudioTime(75)).toBe('01:15')
    expect(formatAudioTime(Number.NaN)).toBe('00:00')
  })

  it('builds stable waveform bars from channel data', () => {
    const channelData = new Float32Array([
      0, 0.2, -0.4, 0.3, -0.1, 0.05, 0.6, -0.5, 0.8, -1,
    ])

    const bars = buildWaveformBars(channelData, {
      barCount: 5,
      maxHeight: 24,
      minHeight: 8,
    })

    expect(bars).toHaveLength(5)
    expect(Math.min(...bars)).toBeGreaterThanOrEqual(8)
    expect(Math.max(...bars)).toBeLessThanOrEqual(24)
  })
})
