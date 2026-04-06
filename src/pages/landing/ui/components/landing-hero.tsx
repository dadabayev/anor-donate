import cn from '../landing-page.module.css'

import { LANDING_ASSETS } from '../landing-assets'
import { Link } from 'react-router-dom'

export const LandingHero = () => (
  <section className={cn.hero} aria-labelledby="hero-title">
    <div className={cn.heroShell}>
      <div className={cn.heroGrid}>
        <div className={cn.heroCopy}>
          <span className={cn.badgePill}>Stream Aloqa</span>
          <h1 id="hero-title" className={cn.heroTitle}>
            Strimer va uning muxlislari uchun o‘zaro aloqa va qo‘llab
            quvvatlashni osonlashtiradigan platforma
          </h1>
          <p className={cn.heroSubtitle}>
            Yoqtirgan blogeringizni qo‘llab-quvvatlang!
          </p>
          <div className={cn.heroCtas}>
            <Link to="/sign-in" className={cn.btnPrimary}>
              Kirish
            </Link>
            <Link to="/sign-up" className={cn.btnSecondary}>
              Ro‘yxatdan O‘tish
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
