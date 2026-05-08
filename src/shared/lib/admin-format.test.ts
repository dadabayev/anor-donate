import { describe, expect, it } from 'vitest'

import {
  formatAdminDateTime,
  formatDurationMmSs,
  parseDurationToSeconds,
} from './admin-format'

describe('formatAdminDateTime', () => {
  it('formats ISO instant to local calendar parts', () => {
    const s = formatAdminDateTime('2026-05-08T10:30:00.000Z')
    expect(s).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })

  it('returns input when invalid', () => {
    expect(formatAdminDateTime('not-a-date')).toBe('not-a-date')
  })
})

describe('formatDurationMmSs', () => {
  it('pads seconds', () => {
    expect(formatDurationMmSs(65)).toBe('1:05')
  })

  it('handles zero', () => {
    expect(formatDurationMmSs(0)).toBe('0:00')
  })
})

describe('parseDurationToSeconds', () => {
  it('parses m:ss', () => {
    expect(parseDurationToSeconds('1:05')).toBe(65)
  })

  it('parses h:mm:ss', () => {
    expect(parseDurationToSeconds('1:01:01')).toBe(3661)
  })

  it('returns 0 on garbage', () => {
    expect(parseDurationToSeconds('x')).toBe(0)
  })
})
