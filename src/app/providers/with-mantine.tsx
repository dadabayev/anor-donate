import { MantineProvider } from '@mantine/core'

export const WithMantine = ({ children }: { children: React.ReactNode }) => {
  return <MantineProvider>{children}</MantineProvider>
}
