import { mapUserMeToProfileData } from './map-user-me-to-profile'
import { fetchUserMe } from '@shared/api'
import { useQuery } from '@tanstack/react-query'

export const USER_ME_QUERY_KEY = ['user', 'me'] as const

const staleTimeMs = 5 * 60 * 1000

export const useUserMeProfileQuery = () =>
  useQuery({
    queryKey: USER_ME_QUERY_KEY,
    queryFn: async () => mapUserMeToProfileData(await fetchUserMe()),
    staleTime: staleTimeMs,
    retry: 1,
  })
