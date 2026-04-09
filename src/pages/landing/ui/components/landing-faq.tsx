import cn from '../landing-page.module.css'

import { IconChevronDown } from '@tabler/icons-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const LandingFaq = () => {
  const { t } = useTranslation()
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const faqBaseId = useId()

  return (
    <section id="faq" className={cn.faq} aria-labelledby="faq-title">
      <div className={cn.inner}>
        <div className={cn.faqInner}>
          <h2 id="faq-title" className={cn.faqTitle}>
            {t('landing.faq.title')}
          </h2>
          <p className={cn.faqIntro}>{t('landing.faq.intro')}</p>
          <div className={cn.faqList}>
            {Array.from({ length: 7 }, (_, index) => {
              const panelId = `${faqBaseId}-panel-${index}`
              const triggerId = `${faqBaseId}-trigger-${index}`
              const open = faqOpen === index

              return (
                <div key={triggerId} className={cn.faqItem}>
                  <button
                    type="button"
                    id={triggerId}
                    className={cn.faqTrigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setFaqOpen(open ? null : index)}
                  >
                    {t('landing.faq.question')}
                    <IconChevronDown
                      size={24}
                      stroke={1.75}
                      className={`${cn.faqChevron} ${open ? cn.faqChevronOpen : ''}`}
                      aria-hidden
                    />
                  </button>
                  {open ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className={cn.faqPanel}
                    >
                      {t('landing.faq.answer')}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
