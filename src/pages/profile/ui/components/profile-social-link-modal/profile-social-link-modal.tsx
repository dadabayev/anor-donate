import cn from './profile-social-link-modal.module.css'

import type { ProfileSocialLink } from '../../../model/profile'
import {
  type SocialLinkFormValues,
  socialLinkSchema,
} from '../../../model/social-link.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputField, Modal } from '@shared/ui'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface ProfileSocialLinkModalProps {
  isOpen: boolean
  social: ProfileSocialLink | null
  isSaving: boolean
  submitError: string | null
  labels: {
    title: string
    save: string
    saving: string
    close: string
    placeholder: string
    invalidUrl: string
  }
  onClose: () => void
  onSubmit: (socialId: string, link: string) => void
}

export const ProfileSocialLinkModal = ({
  isOpen,
  social,
  isSaving,
  submitError,
  labels,
  onClose,
  onSubmit,
}: Readonly<ProfileSocialLinkModalProps>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      link: '',
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    reset({
      link: social?.url ?? '',
    })
  }, [isOpen, reset, social?.url])

  const handleFormSubmit = handleSubmit((values) => {
    if (!social) {
      return
    }
    onSubmit(social.id, values.link.trim())
  })

  const errorText = errors.link ? labels.invalidUrl : submitError

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={labels.title}
      closeAriaLabel={labels.close}
      width="md"
      footer={
        <button
          type="submit"
          form="profile-social-link-form"
          className={cn.modalSaveButton}
          disabled={isSaving}
        >
          {isSaving ? labels.saving : labels.save}
        </button>
      }
    >
      <form
        id="profile-social-link-form"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <InputField
          label={social?.name ?? ''}
          placeholder={labels.placeholder}
          disabled={isSaving}
          error={errorText ?? undefined}
          {...register('link')}
        />
      </form>
    </Modal>
  )
}
