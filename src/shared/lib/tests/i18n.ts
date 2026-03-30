import { Locales } from '../../types'
import { resources } from '../i18n/resources'
import { createInstance } from 'i18next'

export const instance = createInstance()

instance.init({
  defaultNS: 'translation',
  lng: Locales.ru,
  fallbackLng: Locales.en,
  resources,
  debug: false,
})
