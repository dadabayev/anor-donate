import cn from '../landing-page.module.css'

import { LANDING_ASSETS } from '../landing-assets'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const LandingHero = () => {
  const { t } = useTranslation()

  return (
    <section className={cn.hero} aria-labelledby="hero-title">
      <div className={cn.heroShell}>
        <div className={cn.heroGrid}>
          <div className={cn.heroCopy}>
            <span className={cn.badgePill}>{t('landing.hero.badge')}</span>
            <h1 id="hero-title" className={cn.heroTitle}>
              {t('landing.hero.title')}
            </h1>
            <p className={cn.heroSubtitle}>{t('landing.hero.subtitle')}</p>
            <div className={cn.heroCtas}>
              <Link to="/sign-in" className={cn.btnPrimary}>
                {t('landing.hero.signIn')}
              </Link>
              <Link to="/sign-up" className={cn.btnSecondary}>
                {t('landing.hero.signUp')}
              </Link>
            </div>
          </div>
          <div className={cn.heroMedia} aria-hidden>
            <div className={cn.heroAura} />
            <div className={cn.heroVisual}>
              <div className={cn.heroVisualCrop}>
                <picture>
                  <source
                    media="(min-width: 1024px)"
                    srcSet={LANDING_ASSETS.heroPomegranate}
                  />
                  <img
                    src={LANDING_ASSETS.heroPomegranateMobile}
                    alt=""
                    className={cn.heroImg}
                    width={430}
                    height={439}
                    decoding="async"
                    fetchPriority="high"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
