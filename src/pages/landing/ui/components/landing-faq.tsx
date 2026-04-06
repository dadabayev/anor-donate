import cn from '../landing-page.module.css'

import { IconChevronDown } from '@tabler/icons-react'
import { useId, useState } from 'react'

const FAQ_QUESTION = 'Bu platforma nima uchun kerak?'

const FAQ_ANSWER =
  'Strimer va muxlislar o‘rtasida oson aloqa o‘rnatish va qo‘llab-quvvatlashni qulay tarzda qabul qilish uchun.'

const FAQ_INTRO =
  'Platforma haqida eng ko‘p beriladigan savollarga javoblarni shu yerda topishingiz mumkin. Barcha asosiy funksiyalar va foydalanish jarayoni oddiy va tushunarli tarzda tushuntirilgan.'

export const LandingFaq = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const faqBaseId = useId()

  return (
    <section id="faq" className={cn.faq} aria-labelledby="faq-title">
      <div className={cn.inner}>
        <div className={cn.faqInner}>
          <h2 id="faq-title" className={cn.faqTitle}>
            Tez-tez so‘raladigan savollar
          </h2>
          <p className={cn.faqIntro}>{FAQ_INTRO}</p>
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
                    {FAQ_QUESTION}
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
                      {FAQ_ANSWER}
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
