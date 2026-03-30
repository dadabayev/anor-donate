import 'i18next'

import type { defaultNS } from '../config/i18n'
import type { resources } from '@shared/lib'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['ru']
  }
}
