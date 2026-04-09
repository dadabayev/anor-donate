import cn from '../landing-page.module.css'

import { useLandingHashNav } from '../../lib/use-landing-hash-nav'
import { LANDING_ASSETS } from '../landing-assets'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const LandingFooter = () => {
  const { t } = useTranslation()
  const onNavClick = useLandingHashNav()

  return (
    <footer className={cn.footer}>
      <div className={cn.inner}>
        <div className={cn.footerGrid}>
          <div>
            <div className={cn.logoRow}>
              <img
                src={LANDING_ASSETS.logoMark}
                alt=""
                className={cn.logoMark}
                width={48}
                height={48}
                decoding="async"
              />
              <span className={cn.logoText}>{t('landing.brandName')}</span>
            </div>
            <p className={cn.footerBrandText}>
              {t('landing.footer.brandText')}
            </p>
            <Link to="/dashboard" className={cn.btnPrimary}>
              {t('landing.footer.signIn')}
            </Link>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>
              {t('landing.footer.columns.platform')}
            </h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="#how" onClick={(e) => onNavClick(e, '#how')}>
                  {t('landing.footer.links.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  {t('landing.footer.links.publicOffer')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>
              {t('landing.footer.columns.help')}
            </h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="#faq" onClick={(e) => onNavClick(e, '#faq')}>
                  {t('landing.footer.links.faq')}
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  {t('landing.footer.links.support')}
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  {t('landing.footer.links.privacy')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>
              {t('landing.footer.columns.contact')}
            </h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="https://telegram.org" target="_blank" rel="noreferrer">
                  {t('landing.footer.social.telegram')}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('landing.footer.social.instagram')}
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  {t('landing.footer.social.youtube')}
                </a>
              </li>
              <li>
                <a href="mailto:support@anordonate.uz">
                  {t('landing.footer.emailLine')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={cn.footerBar}>
        <p className={cn.footerCopy}>
          {t('landing.footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
