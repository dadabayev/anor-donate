import cn from '../landing-page.module.css'

import { useState } from 'react'

const HOW_TABS = ['Matnli donat', 'Ovozli donat', 'Mem yuborish'] as const

const FEATURE_TAGS = ['Oson', 'Tez', 'Qulay', 'Real vaqt'] as const

const FEATURE_BODY =
  'Tomoshabinlardan moliyaviy qo‘llab-quvvatlashlarni qabul qiling va ularni translatsiyangizda ko‘rsating. Ko‘plab sozlamalar yordamida bildirishnomalar ko‘rinishini o‘zingizga moslab sozlang.'

export const LandingAbout = () => {
  const [howTab, setHowTab] = useState(0)

  return (
    <section id="how" className={cn.how} aria-labelledby="how-title">
      <div className={cn.inner}>
        <h2 id="how-title" className={cn.howTitle}>
          Bu qanday ishlaydi?
        </h2>
        <div className={cn.tabSwitch} role="tablist" aria-label="Rejimlar">
          {HOW_TABS.map((label, index) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={howTab === index}
              className={`${cn.tab} ${howTab === index ? cn.tabActive : ''}`}
              onClick={() => setHowTab(index)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className={cn.howBody}>
          <div className={cn.howWidget} aria-hidden>
            <div className={cn.widget}>
              <p className={cn.widgetLabel}>Виджет</p>
            </div>
          </div>
          <div className={cn.howCopy}>
            <h3 className={cn.featureTitle}>Xabarlarni qabul qiling</h3>
            <p className={cn.featureText}>{FEATURE_BODY}</p>
            <div className={cn.tagRow}>
              {FEATURE_TAGS.map((tag) => (
                <span key={tag} className={cn.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
