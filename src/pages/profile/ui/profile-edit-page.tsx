import { DEFAULT_PROFILE } from '../model/profile'
import { useUserMeProfile } from '../model/use-user-me-profile'
import { ProfileEditor, ProfileLoading, ProfileState } from './components'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const ProfileEditPage = () => {
  const { t } = useTranslation()
  const query = useUserMeProfile()

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
          void query.refetch()
        }}
        text={t('profile.errorText')}
        icon={<IconAlertTriangle size={44} stroke={1.8} color="#b42318" />}
        stateTitle={t('profile.errorTitle')}
      />
    )
  }

  return <ProfileEditor initialProfile={query.data ?? DEFAULT_PROFILE} />
}
