import {
  DEFAULT_PROFILE,
  PROFILE_MODE_KEY,
  type ProfileData,
  readProfile,
  writeProfile,
} from '../model/profile'
import { ProfileEditor, ProfileLoading, ProfileState } from './components'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const loadProfile = async (): Promise<ProfileData | null> => {
  await new Promise((resolve) => window.setTimeout(resolve, 450))
  return readProfile()
}

export const ProfilePage = () => {
  const { t } = useTranslation()
  const query = useQuery({
    queryKey: ['profile-page'],
    queryFn: loadProfile,
  })

  if (query.isLoading) {
    return <ProfileLoading title={t('profile.pageTitle')} />
  }

  if (query.isError) {
    return (
      <ProfileState
        title={t('profile.pageTitle')}
        actionLabel={t('profile.retry')}
        image={null}
        onAction={() => {
          window.localStorage.removeItem(PROFILE_MODE_KEY)
          void query.refetch()
        }}
        text={t('profile.errorText')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        stateTitle={t('profile.errorTitle')}
      />
    )
  }

  if (query.data === null) {
    return (
      <ProfileState
        title={t('profile.pageTitle')}
        actionLabel={t('profile.createProfile')}
        image="/assets/empty-item.svg"
        onAction={() => {
          writeProfile(DEFAULT_PROFILE)
          void query.refetch()
        }}
        text={t('profile.emptyText')}
        stateTitle={t('profile.emptyTitle')}
      />
    )
  }

  return <ProfileEditor initialProfile={query.data ?? DEFAULT_PROFILE} />
}
