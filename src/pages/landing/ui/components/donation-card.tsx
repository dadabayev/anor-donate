import cn from '../landing-page.module.css'

import {
  formatUzsDigitsForInput,
  parseDigitsFromInput,
} from '../../lib/format-uzs-input'
import {
  createDonationFormSchema,
  type DonationFormValues,
} from '../../model/donation-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

function localeTagForI18n(language: string) {
  if (language.startsWith('ru')) {
    return 'ru-RU'
  }
  if (language.startsWith('uz')) {
    return 'uz-UZ'
  }
  return 'en-US'
}

export const DonationCard = () => {
  const { t, i18n } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const localeTag = localeTagForI18n(i18n.language)
  const donationFormSchema = useMemo(
    () => createDonationFormSchema(t, localeTag),
    [t, localeTag],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: { amountDisplay: '' },
    mode: 'onBlur',
  })

  const onValid = () => {
    setSubmitted(true)
    reset({ amountDisplay: '' })
  }

  return (
    <section id="donate" className={cn.donate} aria-labelledby="donate-title">
      <div className={cn.inner}>
        <div className={cn.donateCardWrap}>
          <div className={cn.donateCard}>
            <h2 id="donate-title" className={cn.donateTitle}>
              {t('landing.donation.title')}
            </h2>
            <p className={cn.donateLead}>{t('landing.donation.lead')}</p>
            <form
              className={cn.donateForm}
              onSubmit={handleSubmit(onValid)}
              noValidate
            >
              <label className={cn.fieldLabel} htmlFor="donate-amount">
                {t('landing.donation.amountLabel')}
              </label>
              <div className={cn.inputWrap}>
                <Controller
                  name="amountDisplay"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="donate-amount"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="0"
                      className={`${cn.donateInput} ${errors.amountDisplay ? cn.donateInputInvalid : ''}`}
                      aria-invalid={errors.amountDisplay ? true : undefined}
                      aria-describedby={
                        errors.amountDisplay
                          ? 'donate-amount-error'
                          : 'donate-amount-hint'
                      }
                      onChange={(e) => {
                        const digits = parseDigitsFromInput(e.target.value)
                        field.onChange(formatUzsDigitsForInput(digits))
                      }}
                    />
                  )}
                />
                <span className={cn.inputSuffix} aria-hidden>
                  {t('landing.donation.currencySuffix')}
                </span>
              </div>
              {errors.amountDisplay ? (
                <p
                  id="donate-amount-error"
                  className={cn.fieldError}
                  role="alert"
                >
                  {errors.amountDisplay.message}
                </p>
              ) : (
                <p id="donate-amount-hint" className={cn.fieldHint}>
                  {t('landing.donation.hint')}
                </p>
              )}
              <button
                type="submit"
                className={`${cn.btnPrimary} ${cn.donateSubmit}`}
              >
                {t('landing.donation.submit')}
              </button>
            </form>
            {submitted ? (
              <p className={cn.donateSuccess} role="status">
                {t('landing.donation.success')}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
