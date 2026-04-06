import cn from '../landing-page.module.css'

import {
  formatUzsDigitsForInput,
  parseDigitsFromInput,
} from '../../lib/format-uzs-input'
import {
  donationFormSchema,
  type DonationFormValues,
} from '../../model/donation-form.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

export const DonationCard = () => {
  const [submitted, setSubmitted] = useState(false)

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
              Donat miqdori
            </h2>
            <p className={cn.donateLead}>
              Summani kiriting — raqamlar avtomatik ajratiladi (so‘m).
            </p>
            <form
              className={cn.donateForm}
              onSubmit={handleSubmit(onValid)}
              noValidate
            >
              <label className={cn.fieldLabel} htmlFor="donate-amount">
                Summa
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
                  so‘m
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
                  Minimal va maksimal cheklovlar tekshiriladi.
                </p>
              )}
              <button
                type="submit"
                className={`${cn.btnPrimary} ${cn.donateSubmit}`}
              >
                Davom etish
              </button>
            </form>
            {submitted ? (
              <p className={cn.donateSuccess} role="status">
                Summa qabul qilindi. Keyingi qadam uchun akkauntingizga kiring.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
