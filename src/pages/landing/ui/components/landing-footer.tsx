import cn from '../landing-page.module.css'

import { useLandingHashNav } from '../../lib/use-landing-hash-nav'
import { LANDING_ASSETS } from '../landing-assets'
import { Link } from 'react-router-dom'

export const LandingFooter = () => {
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
              <span className={cn.logoText}>Anor Donate</span>
            </div>
            <p className={cn.footerBrandText}>
              Strimerlar va blogerlar uchun muxlislaridan donat qabul qilishni
              osonlashtiradigan platforma.
            </p>
            <Link to="/dashboard" className={cn.btnPrimary}>
              Kirish
            </Link>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>Platforma</h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="#how" onClick={(e) => onNavClick(e, '#how')}>
                  Qanday ishlaydi
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  Ommaviy oferta
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>Yordam</h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="#faq" onClick={(e) => onNavClick(e, '#faq')}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  Qo‘llab-quvvatlash
                </a>
              </li>
              <li>
                <a href="#top" onClick={(e) => onNavClick(e, '#top')}>
                  Maxfiylik siyosati
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={cn.footerColTitle}>Bog‘lanish</h3>
            <ul className={cn.footerLinks}>
              <li>
                <a href="https://telegram.org" target="_blank" rel="noreferrer">
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href="mailto:support@anordonate.uz">
                  Email: support@anordonate.uz
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={cn.footerBar}>
        <p className={cn.footerCopy}>
          © 2025 Anor Donate. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  )
}
