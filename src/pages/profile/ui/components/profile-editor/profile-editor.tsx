import cn from './profile-editor.module.css'

import {
  DEFAULT_PROFILE,
  type ProfileData,
  type ProfileFormValues,
  type ProfileSocialLink,
  writeProfile,
} from '../../../model/profile'
import { profileSchema } from '../../../model/profile.schema'
import { ProfileHeaderSection } from '../profile-header-section'
import { ProfileMainInfoSection } from '../profile-main-info-section'
import { ProfileSaveStatus, type SaveState } from '../profile-save-status'
import {
  ChangeEmailModal,
  ChangePasswordModal,
  ChangePhoneModal,
  VerifyCodeModal,
} from '../profile-security-modals'
import { ProfileSocialLinkModal } from '../profile-social-link-modal'
import { ProfileSocialSection } from '../profile-social-section'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type SecurityModalType = 'email' | 'phone' | 'password' | 'verify' | null
type VerificationTarget = 'email' | 'phone' | null

const buildSavePayload = (
  values: ProfileFormValues,
  current: ProfileData,
  socialLinks: ProfileSocialLink[],
  avatarUrl: string | null,
) => ({
  ...current,
  ...values,
  socialLinks,
  avatarUrl,
})

export const ProfileEditor = ({
  initialProfile,
}: {
  initialProfile: ProfileData
}) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const avatarObjectUrlRef = useRef<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialProfile.avatarUrl,
  )
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null)
  const [socialLinks, setSocialLinks] = useState<ProfileSocialLink[]>(
    initialProfile.socialLinks,
  )
  const [activeSocial, setActiveSocial] = useState<ProfileSocialLink | null>(
    null,
  )
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [socialModalError, setSocialModalError] = useState<string | null>(null)
  const [securityModalType, setSecurityModalType] =
    useState<SecurityModalType>(null)
  const [verificationTarget, setVerificationTarget] =
    useState<VerificationTarget>(null)
  const [pendingVerificationValue, setPendingVerificationValue] = useState<
    string | null
  >(null)
  const [verificationSecondsLeft, setVerificationSecondsLeft] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfile,
    mode: 'onTouched',
  })

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        window.URL.revokeObjectURL(avatarObjectUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (saveState !== 'success' && saveState !== 'error') {
      return
    }

    const timeout = window.setTimeout(() => {
      setSaveState('idle')
      setSaveMessage('')
    }, 2500)

    return () => window.clearTimeout(timeout)
  }, [saveState])

  useEffect(() => {
    if (securityModalType !== 'verify' || verificationSecondsLeft <= 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setVerificationSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [securityModalType, verificationSecondsLeft])

  const mutation = useMutation({
    mutationFn: async (payload: ProfileData) => {
      await new Promise((resolve) => window.setTimeout(resolve, 550))
      writeProfile(payload)
      return payload
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['profile-page'], saved)
      setSaveState('success')
      setSaveMessage(t('profile.saveSuccessMessage'))
    },
    onError: () => {
      setSaveState('error')
      setSaveMessage(t('profile.saveErrorMessage'))
    },
  })

  const socialMutation = useMutation({
    mutationFn: async ({
      socialId,
      url,
    }: {
      socialId: string
      url: string
    }) => {
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      if (url.includes('fail')) {
        throw new Error('Simulated social link save error')
      }

      return { socialId, url }
    },
    onSuccess: ({ socialId, url }) => {
      setSocialLinks((current) => {
        const nextSocialLinks = current.map((social) =>
          social.id === socialId
            ? {
                ...social,
                state: 'connected' as const,
                url,
              }
            : social,
        )
        const nextProfile = buildSavePayload(
          getValues(),
          initialProfile,
          nextSocialLinks,
          avatarUrl,
        )
        writeProfile(nextProfile)
        queryClient.setQueryData(['profile-page'], nextProfile)
        return nextSocialLinks
      })
      setActiveSocial(null)
      setSocialModalError(null)
      setSaveState('success')
      setSaveMessage(t('profile.socialLinkSavedMessage'))
    },
    onError: () => {
      setSocialModalError(t('profile.socialModalNetworkError'))
    },
  })

  const handlePickAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (avatarObjectUrlRef.current) {
      window.URL.revokeObjectURL(avatarObjectUrlRef.current)
    }

    const objectUrl = window.URL.createObjectURL(file)
    avatarObjectUrlRef.current = objectUrl
    setAvatarUrl(objectUrl)
    setAvatarFileName(file.name)
  }

  const handleSubmitForm = handleSubmit((values) => {
    setSaveState('saving')
    setSaveMessage(t('profile.saving'))
    mutation.mutate(
      buildSavePayload(values, initialProfile, socialLinks, avatarUrl),
    )
  })

  const handleRemoveSocial = (id: string) => {
    setSocialLinks((current) =>
      current.map((social) =>
        social.id === id
          ? {
              ...social,
              state: 'available' as const,
              url: null,
            }
          : social,
      ),
    )
  }

  const handleOpenSocial = (social: ProfileSocialLink) => {
    setActiveSocial(social)
    setSocialModalError(null)
  }

  const handleCloseSocialModal = () => {
    if (socialMutation.isPending) {
      return
    }
    setActiveSocial(null)
    setSocialModalError(null)
  }

  const handleSubmitSocialModal = (socialId: string, link: string) => {
    setSocialModalError(null)
    socialMutation.mutate({ socialId, url: link })
  }

  const securityMutation = useMutation({
    mutationFn: async ({
      field,
      value,
      currentPassword,
      nextPassword,
    }: {
      field: 'email' | 'phone' | 'password'
      value: string
      currentPassword?: string
      nextPassword?: string
    }) => {
      await new Promise((resolve) => window.setTimeout(resolve, 600))

      if (value.includes('fail')) {
        throw new Error(t('profile.securitySubmitError'))
      }

      if (field === 'password') {
        const currentStoredPassword = getValues('password')
        if (currentPassword !== currentStoredPassword) {
          throw new Error(t('profile.invalidCurrentPasswordError'))
        }

        return {
          field,
          value: nextPassword ?? value,
          requiresVerification: false,
        }
      }

      return {
        field,
        value,
        requiresVerification: true,
      }
    },
  })

  const verificationMutation = useMutation({
    mutationFn: async (code: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      if (code !== '123456') {
        throw new Error(t('profile.invalidVerificationCodeError'))
      }
      return code
    },
  })

  const applySecurityValue = (
    field: 'email' | 'phone' | 'password',
    value: string,
  ) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldValidate: true,
    })

    const nextProfile = buildSavePayload(
      {
        ...getValues(),
        [field]: value,
      },
      initialProfile,
      socialLinks,
      avatarUrl,
    )
    writeProfile(nextProfile)
    queryClient.setQueryData(['profile-page'], nextProfile)
    setSaveState('success')
    setSaveMessage(t('profile.securityUpdateSuccess'))
  }

  const handleOpenSecurityModal = (
    type: Exclude<SecurityModalType, 'verify' | null>,
  ) => {
    if (isBusy || isSecurityBusy || verificationMutation.isPending) {
      return
    }
    setSecurityModalType(type)
  }

  const handleCloseSecurityModal = () => {
    if (isSecurityBusy || verificationMutation.isPending) {
      return
    }
    setSecurityModalType(null)
    setVerificationTarget(null)
    setPendingVerificationValue(null)
    setVerificationSecondsLeft(0)
  }

  const handleSubmitEmailChange = async (email: string) => {
    const result = await securityMutation.mutateAsync({
      field: 'email',
      value: email,
    })

    if (result.requiresVerification) {
      setVerificationTarget('email')
      setPendingVerificationValue(result.value)
      setSecurityModalType('verify')
      setVerificationSecondsLeft(60)
      setSaveState('idle')
      setSaveMessage('')
      return
    }

    applySecurityValue('email', result.value)
    handleCloseSecurityModal()
  }

  const handleSubmitPhoneChange = async (phone: string) => {
    const result = await securityMutation.mutateAsync({
      field: 'phone',
      value: phone,
    })

    if (result.requiresVerification) {
      setVerificationTarget('phone')
      setPendingVerificationValue(result.value)
      setSecurityModalType('verify')
      setVerificationSecondsLeft(60)
      setSaveState('idle')
      setSaveMessage('')
      return
    }

    applySecurityValue('phone', result.value)
    handleCloseSecurityModal()
  }

  const handleSubmitPasswordChange = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const result = await securityMutation.mutateAsync({
      field: 'password',
      value: newPassword,
      currentPassword,
      nextPassword: newPassword,
    })

    applySecurityValue('password', result.value)
    handleCloseSecurityModal()
  }

  const handleSubmitVerification = async (code: string) => {
    if (!verificationTarget || !pendingVerificationValue) {
      throw new Error(t('profile.securitySubmitError'))
    }

    await verificationMutation.mutateAsync(code)
    applySecurityValue(verificationTarget, pendingVerificationValue)
    handleCloseSecurityModal()
  }

  const handleResendVerification = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setVerificationSecondsLeft(60)
  }

  const isBusy = mutation.isPending
  const isSecurityBusy = securityMutation.isPending
  const securityBusy = isSecurityBusy || verificationMutation.isPending
  const firstLetter = initialProfile.firstName.trim().charAt(0) || 'A'
  const fullName =
    `${initialProfile.firstName} ${initialProfile.lastName}`.trim()

  return (
    <section className={cn.page}>
      <div className={cn.column}>
        <header className={cn.header}>
          <div className={cn.headerRow}>
            <h1 className={cn.title}>{t('profile.pageTitle')}</h1>
            <Link className={cn.backToView} to="/profile">
              {t('profile.backToProfile')}
            </Link>
          </div>
        </header>

        <div className={cn.card}>
          <ProfileHeaderSection
            title={t('profile.sectionTitle')}
            pickFileLabel={t('profile.pickFile')}
            avatarUrl={avatarUrl}
            firstLetter={firstLetter}
            fullName={fullName}
            avatarFileName={avatarFileName}
            avatarInputRef={avatarInputRef}
            isBusy={isBusy}
            onPickAvatar={handlePickAvatar}
          />

          <form className={cn.form} onSubmit={handleSubmitForm} noValidate>
            <ProfileMainInfoSection
              title={t('profile.mainInfo')}
              changeLabel={t('profile.change')}
              isBusy={isBusy}
              isSecurityBusy={isSecurityBusy || verificationMutation.isPending}
              errors={errors}
              register={register}
              onChangePhone={() => handleOpenSecurityModal('phone')}
              onChangeEmail={() => handleOpenSecurityModal('email')}
              onChangePassword={() => handleOpenSecurityModal('password')}
              labels={{
                firstName: t('profile.firstName'),
                lastName: t('profile.lastName'),
                pnfl: t('profile.pnfl'),
                phone: t('profile.phone'),
                email: t('profile.email'),
                password: t('profile.password'),
                username: t('profile.username'),
                channelName: t('profile.channelName'),
                channelLink: t('profile.channelLink'),
                channelAbout: t('profile.channelAbout'),
              }}
              placeholders={{
                firstName: t('profile.firstNamePlaceholder'),
                lastName: t('profile.lastNamePlaceholder'),
                pnfl: t('profile.pnflPlaceholder'),
                phone: t('profile.phonePlaceholder'),
                email: t('profile.emailPlaceholder'),
                password: t('profile.passwordPlaceholder'),
                username: t('profile.usernamePlaceholder'),
                channelName: t('profile.channelNamePlaceholder'),
                channelLink: t('profile.channelLinkPlaceholder'),
                channelAbout: t('profile.channelAboutPlaceholder'),
              }}
            />

            <ProfileSocialSection
              title={t('profile.socialTitle')}
              socialLinks={socialLinks}
              onRemoveSocial={handleRemoveSocial}
              onOpenSocial={handleOpenSocial}
              onRestoreDefaults={() =>
                setSocialLinks(DEFAULT_PROFILE.socialLinks)
              }
              labels={{
                emptySocials: t('profile.emptySocials'),
                emptySocialsText: t('profile.emptySocialsText'),
                restoreSocials: t('profile.restoreSocials'),
              }}
            />

            <ProfileSaveStatus
              saveState={saveState}
              saveMessage={saveMessage}
              savingLabel={t('profile.saving')}
            />

            <footer className={cn.footer}>
              <button type="submit" className={cn.saveButton} disabled={isBusy}>
                {t('profile.save')}
              </button>
            </footer>
          </form>
        </div>
      </div>

      <ProfileSocialLinkModal
        isOpen={activeSocial !== null}
        social={activeSocial}
        isSaving={socialMutation.isPending}
        submitError={socialModalError}
        onClose={handleCloseSocialModal}
        onSubmit={handleSubmitSocialModal}
        labels={{
          title: t('profile.socialModalTitle'),
          save: t('profile.socialModalSave'),
          saving: t('profile.socialModalSaving'),
          close: t('profile.socialModalClose'),
          placeholder: t('profile.socialModalPlaceholder'),
          invalidUrl: t('profile.socialModalInvalidUrl'),
        }}
      />

      {securityModalType === 'email' ? (
        <ChangeEmailModal
          isBusy={securityBusy}
          initialEmail={getValues('email')}
          labels={{
            emailTitle: t('profile.emailModalTitle'),
            emailLabel: t('profile.emailModalLabel'),
            submit: t('profile.change'),
            submitting: t('profile.saving'),
            close: t('profile.modalClose'),
            invalidEmail: t('profile.invalidEmailError'),
          }}
          onClose={handleCloseSecurityModal}
          onSubmit={handleSubmitEmailChange}
        />
      ) : null}

      {securityModalType === 'phone' ? (
        <ChangePhoneModal
          isBusy={securityBusy}
          initialPhone={getValues('phone')}
          labels={{
            phoneTitle: t('profile.phoneModalTitle'),
            phoneLabel: t('profile.phoneModalLabel'),
            submit: t('profile.change'),
            submitting: t('profile.saving'),
            close: t('profile.modalClose'),
            invalidPhone: t('profile.invalidPhoneError'),
          }}
          onClose={handleCloseSecurityModal}
          onSubmit={handleSubmitPhoneChange}
        />
      ) : null}

      {securityModalType === 'password' ? (
        <ChangePasswordModal
          isBusy={securityBusy}
          labels={{
            passwordTitle: t('profile.passwordModalTitle'),
            currentPasswordLabel: t('profile.currentPasswordModalLabel'),
            newPasswordLabel: t('profile.newPasswordModalLabel'),
            repeatPasswordLabel: t('profile.repeatPasswordModalLabel'),
            submit: t('profile.change'),
            submitting: t('profile.saving'),
            close: t('profile.modalClose'),
            invalidCurrentPassword: t('profile.invalidCurrentPasswordError'),
            invalidNewPassword: t('profile.invalidNewPasswordError'),
            passwordMismatch: t('profile.passwordMismatchError'),
          }}
          onClose={handleCloseSecurityModal}
          onSubmit={handleSubmitPasswordChange}
        />
      ) : null}

      {securityModalType === 'verify' ? (
        <VerifyCodeModal
          isBusy={securityBusy}
          verifySecondsLeft={verificationSecondsLeft}
          labels={{
            verificationTitle: t('profile.verifyModalTitle'),
            verifyResend: t('profile.verifyResend'),
            verifyTimerPrefix: t('profile.verifyTimerPrefix'),
            submit: t('profile.change'),
            submitting: t('profile.saving'),
            close: t('profile.modalClose'),
            invalidVerificationCode: t('profile.invalidVerificationCodeError'),
          }}
          onClose={handleCloseSecurityModal}
          onSubmit={handleSubmitVerification}
          onResend={handleResendVerification}
        />
      ) : null}
    </section>
  )
}
