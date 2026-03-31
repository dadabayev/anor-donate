import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

export const WithMantine = ({ children }: { children: React.ReactNode }) => {
  return (
    <MantineProvider>
      <Notifications position="top-right" zIndex={1000} />
      {children}
    </MantineProvider>
  )
}
