import './config/i18n'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './styles/global.css'

import { WithMantine } from './providers/with-mantine'
import { WithQuery } from './providers/with-query'
import { WithRouter } from './providers/with-router'

export const App = () => {
  return (
    <WithMantine>
      <WithQuery>
        <WithRouter />
      </WithQuery>
    </WithMantine>
  )
}
