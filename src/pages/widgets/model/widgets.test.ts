import {
  applyWidgetFormValues,
  createWidgetDraft,
  createWidgetsDashboard,
  readWidgetsPageMode,
  WIDGETS_MODE_KEY,
} from './widgets'
import { afterEach, describe, expect, it } from 'vitest'

describe('widgets model', () => {
  afterEach(() => {
    window.localStorage.removeItem(WIDGETS_MODE_KEY)
  })

  it('creates a detached widgets dashboard copy', () => {
    const first = createWidgetsDashboard()
    const second = createWidgetsDashboard()

    first.widgets[0].title = 'Changed'

    expect(second.widgets[0].title).toBe('Vidjet 1')
  })

  it('reads page mode from local storage safely', () => {
    expect(readWidgetsPageMode()).toBe('default')

    window.localStorage.setItem(WIDGETS_MODE_KEY, 'empty')
    expect(readWidgetsPageMode()).toBe('empty')

    window.localStorage.setItem(WIDGETS_MODE_KEY, 'error')
    expect(readWidgetsPageMode()).toBe('error')
  })

  it('applies form values to a widget without mutating the original object', () => {
    const draft = createWidgetDraft(5)
    const updated = applyWidgetFormValues(draft, {
      autoReadMessage: false,
      durationSeconds: 9,
      fontFamily: 'Inter',
      minimumAmount: 80_000,
      nameColor: '#123456',
      textColor: '#654321',
      title: 'Widget custom',
      voiceTone: 'Ayol',
      volumePercent: 70,
    })

    expect(draft.title).toBe('Vidjet 5')
    expect(updated).toMatchObject({
      title: 'Widget custom',
      minimumAmount: 80_000,
      volumePercent: 70,
      durationSeconds: 9,
      autoReadMessage: false,
      voiceTone: 'Ayol',
      appearance: {
        fontFamily: 'Inter',
        nameColor: '#123456',
        textColor: '#654321',
      },
    })
  })
})
