import cn from '../landing-page.module.css'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const HOW_TAB_KEYS = ['textDonation', 'voiceDonation', 'sendMeme'] as const

const FEATURE_TAG_KEYS = ['easy', 'fast', 'convenient', 'realTime'] as const

export const LandingAbout = () => {
  const { t } = useTranslation()
  const [howTab, setHowTab] = useState(0)

  return (
    <section id="how" className={cn.how} aria-labelledby="how-title">
      <div className={cn.inner}>
        <h2 id="how-title" className={cn.howTitle}>
          {t('landing.about.title')}
        </h2>
        <div
          className={cn.tabSwitch}
          role="tablist"
          aria-label={t('landing.about.modesTablistAriaLabel')}
        >
          {HOW_TAB_KEYS.map((key, index) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={howTab === index}
              className={`${cn.tab} ${howTab === index ? cn.tabActive : ''}`}
              onClick={() => setHowTab(index)}
            >
              {t(`landing.about.tabs.${key}`)}
            </button>
          ))}
        </div>
        <div className={cn.howBody}>
          <div className={cn.howWidget} aria-hidden>
            <div className={cn.widget}>
              <p className={cn.widgetLabel}>{t('landing.about.widgetLabel')}</p>
            </div>
          </div>
          <div className={cn.howCopy}>
            <h3 className={cn.featureTitle}>
              {t('landing.about.featureTitle')}
            </h3>
            <p className={cn.featureText}>{t('landing.about.featureBody')}</p>
            <div className={cn.tagRow}>
              {FEATURE_TAG_KEYS.map((key) => (
                <span key={key} className={cn.tag}>
                  {t(`landing.about.tags.${key}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
