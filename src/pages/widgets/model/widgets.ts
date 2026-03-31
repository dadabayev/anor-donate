export const WIDGETS_MODE_KEY = 'widgets-page-mode'

export type WidgetsPageMode = 'default' | 'empty' | 'error'

export interface WidgetAppearance {
  fontFamily: string
  nameColor: string
  textColor: string
}

export interface WidgetConfig {
  id: string
  title: string
  minimumAmount: number
  volumePercent: number
  durationSeconds: number
  autoReadMessage: boolean
  voiceTone: string
  appearance: WidgetAppearance
}

export interface WidgetsDashboardData {
  streamLink: string
  widgets: WidgetConfig[]
}

export interface WidgetFormValues {
  autoReadMessage: boolean
  durationSeconds: number
  fontFamily: string
  minimumAmount: number
  nameColor: string
  textColor: string
  title: string
  voiceTone: string
  volumePercent: number
}

export const WIDGETS_PAGE_TITLE = 'Vidjetlar'
export const WIDGETS_PAGE_SUBTITLE = 'Barcha vidjetlar'
export const WIDGETS_CREATE_PAGE_SUBTITLE = 'Vidjetlar yaratish'
export const WIDGETS_EDIT_PAGE_SUBTITLE = 'Vidjetni tahrirlash'
export const WIDGETS_EMPTY_TITLE = 'Vidjetlar hali yaratilmagan'
export const WIDGETS_EMPTY_TEXT =
  'Strimingiz uchun birinchi vidjetni yarating va sahifadan boshqaring.'
export const WIDGETS_EMPTY_ACTION = 'Vidjet yaratish'
export const WIDGETS_ERROR_TITLE = "Vidjetlarni yuklab bo'lmadi"
export const WIDGETS_ERROR_TEXT =
  "Ma'lumotlarni qayta yuklab ko'ring yoki vaqtinchalik xatoni keyinroq takrorlang."
export const WIDGETS_RETRY_ACTION = 'Qayta yuklash'
export const WIDGETS_CREATE_ACTION = 'Vidjet qoshish'
export const WIDGETS_COPY_ACTION = 'Strim havolasini nusxalash'

export const WIDGET_FONT_OPTIONS = [
  'Roboto Flex',
  'Inter',
  'Manrope',
  'Montserrat',
]

export const WIDGET_VOICE_OPTIONS = ['Erkak', 'Ayol', 'Robot']

const DEFAULT_STREAM_LINK = 'https://anordonate.uz/examplelink'

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'widget-1',
    title: 'Vidjet 1',
    minimumAmount: 25_000,
    volumePercent: 100,
    durationSeconds: 7,
    autoReadMessage: true,
    voiceTone: 'Erkak',
    appearance: {
      nameColor: '#8B0037',
      textColor: '#8B0037',
      fontFamily: 'Roboto Flex',
    },
  },
  {
    id: 'widget-2',
    title: 'Vidjet 2',
    minimumAmount: 50_000,
    volumePercent: 80,
    durationSeconds: 5,
    autoReadMessage: false,
    voiceTone: 'Ayol',
    appearance: {
      nameColor: '#8B0037',
      textColor: '#4F4F55',
      fontFamily: 'Inter',
    },
  },
  {
    id: 'widget-3',
    title: 'Vidjet 3',
    minimumAmount: 100_000,
    volumePercent: 90,
    durationSeconds: 6,
    autoReadMessage: true,
    voiceTone: 'Robot',
    appearance: {
      nameColor: '#8B0037',
      textColor: '#191815',
      fontFamily: 'Montserrat',
    },
  },
  {
    id: 'widget-4',
    title: 'Vidjet 4',
    minimumAmount: 150_000,
    volumePercent: 75,
    durationSeconds: 8,
    autoReadMessage: false,
    voiceTone: 'Erkak',
    appearance: {
      nameColor: '#5E0B2A',
      textColor: '#6C6C70',
      fontFamily: 'Manrope',
    },
  },
]

const cloneWidget = (widget: WidgetConfig): WidgetConfig => ({
  ...widget,
  appearance: { ...widget.appearance },
})

const cloneWidgetsDashboard = (
  dashboard: WidgetsDashboardData,
): WidgetsDashboardData => ({
  streamLink: dashboard.streamLink,
  widgets: dashboard.widgets.map(cloneWidget),
})

export const createWidgetsDashboard = (): WidgetsDashboardData => ({
  streamLink: DEFAULT_STREAM_LINK,
  widgets: DEFAULT_WIDGETS.map(cloneWidget),
})

export const loadWidgetsDashboard = async (): Promise<WidgetsDashboardData> => {
  await new Promise((resolve) => window.setTimeout(resolve, 450))

  if (readWidgetsPageMode() === 'error') {
    throw new Error('widgets-page-load-failed')
  }

  const data = createWidgetsDashboard()

  if (readWidgetsPageMode() === 'empty') {
    return {
      ...data,
      widgets: [],
    }
  }

  return data
}

export const findWidgetById = (
  dashboard: WidgetsDashboardData,
  widgetId: string,
): WidgetConfig | null => {
  const widget = dashboard.widgets.find((item) => item.id === widgetId)
  return widget ? cloneWidget(widget) : null
}

export const readWidgetsPageMode = (): WidgetsPageMode => {
  if (typeof window === 'undefined') {
    return 'default'
  }

  const rawMode = window.localStorage.getItem(WIDGETS_MODE_KEY)

  if (rawMode === 'empty' || rawMode === 'error') {
    return rawMode
  }

  return 'default'
}

export const createWidgetFormValues = (
  widget: WidgetConfig,
): WidgetFormValues => ({
  autoReadMessage: widget.autoReadMessage,
  durationSeconds: widget.durationSeconds,
  fontFamily: widget.appearance.fontFamily,
  minimumAmount: widget.minimumAmount,
  nameColor: widget.appearance.nameColor,
  textColor: widget.appearance.textColor,
  title: widget.title,
  voiceTone: widget.voiceTone,
  volumePercent: widget.volumePercent,
})

export const createWidgetDraft = (nextIndex: number): WidgetConfig => ({
  id: `widget-${nextIndex}`,
  title: `Vidjet ${nextIndex}`,
  minimumAmount: 25_000,
  volumePercent: 100,
  durationSeconds: 7,
  autoReadMessage: true,
  voiceTone: 'Erkak',
  appearance: {
    nameColor: '#8B0037',
    textColor: '#8B0037',
    fontFamily: 'Roboto Flex',
  },
})

export const applyWidgetFormValues = (
  widget: WidgetConfig,
  values: WidgetFormValues,
): WidgetConfig => ({
  ...widget,
  autoReadMessage: values.autoReadMessage,
  durationSeconds: values.durationSeconds,
  minimumAmount: values.minimumAmount,
  title: values.title.trim(),
  voiceTone: values.voiceTone,
  volumePercent: values.volumePercent,
  appearance: {
    fontFamily: values.fontFamily,
    nameColor: values.nameColor.toUpperCase(),
    textColor: values.textColor.toUpperCase(),
  },
})

export const createWidgetFromFormValues = (
  nextIndex: number,
  values: WidgetFormValues,
): WidgetConfig => applyWidgetFormValues(createWidgetDraft(nextIndex), values)

export const applyWidgetInDashboard = (
  dashboard: WidgetsDashboardData,
  widgetId: string,
  values: WidgetFormValues,
): WidgetsDashboardData => ({
  ...cloneWidgetsDashboard(dashboard),
  widgets: dashboard.widgets.map((widget) =>
    widget.id === widgetId
      ? applyWidgetFormValues(widget, values)
      : cloneWidget(widget),
  ),
})

export const appendWidgetInDashboard = (
  dashboard: WidgetsDashboardData,
  values: WidgetFormValues,
): WidgetsDashboardData => {
  const nextIndex = dashboard.widgets.length + 1
  const nextWidget = createWidgetFromFormValues(nextIndex, values)

  return {
    ...cloneWidgetsDashboard(dashboard),
    widgets: [...dashboard.widgets.map(cloneWidget), nextWidget],
  }
}
