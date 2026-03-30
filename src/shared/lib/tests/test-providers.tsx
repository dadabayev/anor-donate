import { instance as i18n } from './i18n'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'

const queryClient = new QueryClient()

export const TestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ModalsProvider>{children}</ModalsProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </MantineProvider>
    </I18nextProvider>
  )
}
