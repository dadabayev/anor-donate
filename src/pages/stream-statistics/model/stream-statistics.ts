export const STREAM_STATISTICS_MODE_KEY = 'stream-statistics-page-mode'

export type StreamStatisticsPageMode = 'default' | 'error'

/** Settings for one leaderboard block (Umumiy / Oylik / Oxirgi). */
export interface StreamStatisticsSectionSettings {
  streamLink: string
  displayMethod: string
  fontFamily: string
  elementCount: number
}

export type StreamStatisticsSectionKey =
  | 'generalTop'
  | 'monthlyTop'
  | 'recentDonations'

export interface StreamStatisticsSettings {
  generalTop: StreamStatisticsSectionSettings
  monthlyTop: StreamStatisticsSectionSettings
  recentDonations: StreamStatisticsSectionSettings
}

export const STREAM_STATISTICS_PAGE_TITLE = 'Stream statistikasi'
export const STREAM_STATISTICS_PAGE_SUBTITLE = 'Statistika sozlamalari'
export const STREAM_STATISTICS_ERROR_TITLE = "Sozlamalarni yuklab bo'lmadi"
export const STREAM_STATISTICS_ERROR_TEXT =
  "Ma'lumotlarni qayta yuklab ko'ring yoki vaqtinchalik xatoni keyinroq takrorlang."
export const STREAM_STATISTICS_RETRY_ACTION = 'Qayta yuklash'
export const STREAM_STATISTICS_SAVE_SUCCESS =
  'Stream statistikasi sozlamalari saqlandi'
export const STREAM_STATISTICS_COPY_ACTION = 'Strim havolasini nusxalash'

export const DISPLAY_METHOD_OPTIONS = ['Qator', 'Ustun', 'Tarmoq']
export const STREAM_FONT_OPTIONS = [
  'Roboto Flex',
  'Inter',
  'Manrope',
  'Montserrat',
]

const defaultSection = (): StreamStatisticsSectionSettings => ({
  streamLink: 'https://anordonate.uz/examplelink',
  displayMethod: 'Qator',
  fontFamily: 'Roboto Flex',
  elementCount: 31,
})

const DEFAULT_SETTINGS: StreamStatisticsSettings = {
  generalTop: defaultSection(),
  monthlyTop: defaultSection(),
  recentDonations: defaultSection(),
}

export const createStreamStatisticsSettings = (): StreamStatisticsSettings => ({
  generalTop: { ...DEFAULT_SETTINGS.generalTop },
  monthlyTop: { ...DEFAULT_SETTINGS.monthlyTop },
  recentDonations: { ...DEFAULT_SETTINGS.recentDonations },
})

export const loadStreamStatisticsSettings =
  async (): Promise<StreamStatisticsSettings> => {
    await new Promise((resolve) => window.setTimeout(resolve, 420))

    if (readStreamStatisticsPageMode() === 'error') {
      throw new Error('stream-statistics-load-failed')
    }

    return createStreamStatisticsSettings()
  }

export const readStreamStatisticsPageMode = (): StreamStatisticsPageMode => {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const rawMode = window.localStorage.getItem(STREAM_STATISTICS_MODE_KEY)

  if (rawMode === 'error') {
    return 'error'
  }

  return 'default'
}

export const saveStreamStatisticsSettings = async (
  settings: StreamStatisticsSettings,
): Promise<StreamStatisticsSettings> => {
  await new Promise((resolve) => window.setTimeout(resolve, 380))

  if (readStreamStatisticsPageMode() === 'error') {
    throw new Error('stream-statistics-save-failed')
  }

  return {
    generalTop: { ...settings.generalTop },
    monthlyTop: { ...settings.monthlyTop },
    recentDonations: { ...settings.recentDonations },
  }
}
