import {
  createMemeEditorData,
  createMemesDashboard,
  MEMES_PAGE_MODE_KEY,
  readMemesPageMode,
} from './memes'
import { afterEach, describe, expect, it } from 'vitest'

describe('memes model', () => {
  afterEach(() => {
    window.localStorage.removeItem(MEMES_PAGE_MODE_KEY)
  })

  it('creates isolated dashboard copies', () => {
    const first = createMemesDashboard()
    const second = createMemesDashboard()

    first.memes[0].name = 'Changed'

    expect(second.memes[0].name).toBe('Cristiano 1')
  })

  it('reads page mode safely', () => {
    expect(readMemesPageMode(MEMES_PAGE_MODE_KEY)).toBe('default')
    window.localStorage.setItem(MEMES_PAGE_MODE_KEY, 'empty')
    expect(readMemesPageMode(MEMES_PAGE_MODE_KEY)).toBe('empty')
  })

  it('returns edit meme when memeId exists', () => {
    const data = createMemeEditorData('meme-2')
    expect(data.meme?.id).toBe('meme-2')
  })
})
