import { useUserMeProfile } from '../model/use-user-me-profile'
import { ProfileLoading, ProfileState } from './components'
import { ProfileFigmaView } from './profile-figma-view'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const ProfilePage = () => {
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

  if (!query.data) {
    return null
  }

  return <ProfileFigmaView profile={query.data} />
}
