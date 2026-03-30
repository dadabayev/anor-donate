import cn from './profile-main-info-section.module.css'

import type { ProfileFormValues } from '../../../model/profile'
import { InputField } from '@shared/ui'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

interface ProfileMainInfoSectionProps {
  title: string
  changeLabel: string
  isBusy: boolean
  isSecurityBusy: boolean
  errors: FieldErrors<ProfileFormValues>
  register: UseFormRegister<ProfileFormValues>
  onChangePhone: () => void
  onChangeEmail: () => void
  onChangePassword: () => void
  labels: {
    firstName: string
    lastName: string
    pnfl: string
    phone: string
    email: string
    password: string
    username: string
    channelName: string
    channelLink: string
  }
  placeholders: {
    firstName: string
    lastName: string
    pnfl: string
    phone: string
    email: string
    password: string
    username: string
    channelName: string
    channelLink: string
  }
}

export const ProfileMainInfoSection = ({
  title,
  changeLabel,
  isBusy,
  isSecurityBusy,
  errors,
  register,
  onChangePhone,
  onChangeEmail,
  onChangePassword,
  labels,
  placeholders,
}: Readonly<ProfileMainInfoSectionProps>) => {
  return (
    <section className={cn.cardSection} aria-labelledby="profile-main-info">
      <h2 id="profile-main-info" className={cn.sectionTitle}>
        {title}
      </h2>

      <div className={cn.grid}>
        <InputField
          label={labels.firstName}
          error={errors.firstName?.message}
          placeholder={placeholders.firstName}
          disabled={isBusy}
          {...register('firstName')}
        />

        <InputField
          label={labels.lastName}
          error={errors.lastName?.message}
          placeholder={placeholders.lastName}
          disabled={isBusy}
          {...register('lastName')}
        />

        <InputField
          label={labels.pnfl}
          error={errors.pnfl?.message}
          placeholder={placeholders.pnfl}
          disabled={isBusy}
          {...register('pnfl')}
        />

        <InputField
          label={labels.phone}
          error={errors.phone?.message}
          placeholder={placeholders.phone}
          disabled={isBusy || isSecurityBusy}
          readOnly
          actionLabel={changeLabel}
          onAction={onChangePhone}
          actionDisabled={isBusy || isSecurityBusy}
          {...register('phone')}
        />

        <InputField
          label={labels.email}
          error={errors.email?.message}
          placeholder={placeholders.email}
          disabled={isBusy || isSecurityBusy}
          readOnly
          actionLabel={changeLabel}
          onAction={onChangeEmail}
          actionDisabled={isBusy || isSecurityBusy}
          {...register('email')}
        />

        <InputField
          label={labels.password}
          error={errors.password?.message}
          placeholder={placeholders.password}
          disabled={isBusy || isSecurityBusy}
          readOnly
          actionLabel={changeLabel}
          onAction={onChangePassword}
          actionDisabled={isBusy || isSecurityBusy}
          {...register('password')}
        />

        <InputField
          label={labels.username}
          error={errors.username?.message}
          placeholder={placeholders.username}
          disabled={isBusy}
          {...register('username')}
        />

        <InputField
          label={labels.channelName}
          error={errors.channelName?.message}
          placeholder={placeholders.channelName}
          disabled={isBusy}
          {...register('channelName')}
        />

        <InputField
          label={labels.channelLink}
          error={errors.channelLink?.message}
          placeholder={placeholders.channelLink}
          disabled={isBusy}
          className={cn.gridFullWidth}
          {...register('channelLink')}
        />
      </div>
    </section>
  )
}
