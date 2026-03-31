import type { MemeFormValues } from '../model/meme-form.schema'
import {
  createMemeEditorData,
  createMemesDashboard,
  type MemeEditorData,
  MEMES_PAGE_MODE_KEY,
  type MemesDashboardData,
  readMemesPageMode,
  READY_MEMES_MODE_KEY,
} from '../model/memes'

/** Set sessionStorage `memes-delete-fail-once` to `1` before delete to simulate API error (dev/QA). */
export const MEMES_DELETE_FAIL_ONCE_KEY = 'memes-delete-fail-once'

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms))

export const fetchMemesDashboard = async (): Promise<MemesDashboardData> => {
  await delay(420)

  const mode = readMemesPageMode(MEMES_PAGE_MODE_KEY)
  if (mode === 'error') {
    throw new Error('memes-load-failed')
  }

  const data = createMemesDashboard()
  if (mode === 'empty') {
    return { ...data, memes: [] }
  }

  return data
}

export const fetchMemeEditorData = async (
  memeId?: string,
): Promise<MemeEditorData> => {
  await delay(350)
  return createMemeEditorData(memeId)
}

export const fetchReadyMemes = async (): Promise<
  MemeEditorData['readyMemes']
> => {
  await delay(360)
  const mode = readMemesPageMode(READY_MEMES_MODE_KEY)

  if (mode === 'error') {
    throw new Error('ready-memes-load-failed')
  }

  const data = createMemeEditorData()
  if (mode === 'empty') {
    return []
  }

  return data.readyMemes
}

export const saveMeme = async (
  values: MemeFormValues,
  _memeId?: string,
): Promise<MemeFormValues> => {
  await delay(600)
  if (values.name.toLowerCase().includes('fail')) {
    throw new Error('memes-save-failed')
  }
  return values
}

export const deleteMeme = async (_memeId: string): Promise<void> => {
  await delay(550)
  if (
    typeof window !== 'undefined' &&
    window.sessionStorage.getItem(MEMES_DELETE_FAIL_ONCE_KEY) === '1'
  ) {
    window.sessionStorage.removeItem(MEMES_DELETE_FAIL_ONCE_KEY)
    throw new Error('memes-delete-failed')
  }
}
