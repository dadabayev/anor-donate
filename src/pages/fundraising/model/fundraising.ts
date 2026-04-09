export const FUNDRAISING_PAGE_MODE_KEY = 'fundraising-page-mode'

export type FundraisingPageMode = 'default' | 'error'

export interface FundraisingSettings {
  streamLink: string
  name: string
  volumeUzs: number
  durationUzs: number
  showAmount: boolean
  selectedAnimationId: 'a' | 'b' | 'c'
}

export const FUNDRAISING_PAGE_TITLE = "Pul yig'ish"
export const FUNDRAISING_PAGE_SUBTITLE = "Strimda pul yig'ish"
export const FUNDRAISING_ERROR_TITLE = "Ma'lumotlarni yuklab bo'lmadi"
export const FUNDRAISING_ERROR_TEXT =
  "Ma'lumotlarni qayta yuklab ko'ring yoki vaqtinchalik xatoni keyinroq takrorlang."
export const FUNDRAISING_RETRY_ACTION = 'Qayta yuklash'
export const FUNDRAISING_SAVE_SUCCESS = "Pul yig'ish sozlamalari saqlandi"

const DEFAULT_SETTINGS: FundraisingSettings = {
  streamLink: 'https://anordonate.uz/examplelink',
  name: 'Lorem',
  volumeUzs: 25_000,
  durationUzs: 25_000,
  showAmount: true,
  selectedAnimationId: 'a',
}

export const createFundraisingSettings = (): FundraisingSettings => ({
  ...DEFAULT_SETTINGS,
})

export const loadFundraisingSettings =
  async (): Promise<FundraisingSettings> => {
    await new Promise((resolve) => window.setTimeout(resolve, 420))

    if (readFundraisingPageMode() === 'error') {
      throw new Error('fundraising-load-failed')
    }

    return createFundraisingSettings()
  }

export const readFundraisingPageMode = (): FundraisingPageMode => {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const rawMode = window.localStorage.getItem(FUNDRAISING_PAGE_MODE_KEY)

  if (rawMode === 'error') {
    return 'error'
  }

  return 'default'
}

export const saveFundraisingSettings = async (
  settings: FundraisingSettings,
): Promise<FundraisingSettings> => {
  await new Promise((resolve) => window.setTimeout(resolve, 380))

  if (readFundraisingPageMode() === 'error') {
    throw new Error('fundraising-save-failed')
  }

  return { ...settings }
}
