import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
})

export const WithQuery = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
