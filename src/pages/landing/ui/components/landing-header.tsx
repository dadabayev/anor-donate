import cn from '../landing-page.module.css'

import { useLandingHashNav } from '../../lib/use-landing-hash-nav'
import { LANDING_ASSETS } from '../landing-assets'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface LandingHeaderProps {
  drawerOpen: boolean
  onToggleDrawer: () => void
  onCloseDrawer: () => void
}

const NAV_ITEMS = [
  { href: '#top', label: 'Bosh menyu' },
  { href: '#how', label: 'Bu qanday ishlaydi' },
  { href: '#faq', label: 'Savollar' },
  { href: '#bloggers', label: 'Blogerlar' },
] as const

export const LandingHeader = ({
  drawerOpen,
  onToggleDrawer,
  onCloseDrawer,
}: LandingHeaderProps) => {
  const onNavClick = useLandingHashNav(onCloseDrawer)
  const [activeHash, setActiveHash] = useState<string>('#top')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const syncScrollState = () => setIsScrolled(window.scrollY > 16)

    syncScrollState()
    window.addEventListener('scroll', syncScrollState, { passive: true })

    return () => window.removeEventListener('scroll', syncScrollState)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const syncDrawerState = () => {
      if (mediaQuery.matches) {
        onCloseDrawer()
      }
    }

    syncDrawerState()
    mediaQuery.addEventListener('change', syncDrawerState)

    return () => mediaQuery.removeEventListener('change', syncDrawerState)
  }, [onCloseDrawer])

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.href.slice(1)),
    ).filter((section): section is HTMLElement => section !== null)

    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const nextActiveEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (nextActiveEntry?.target.id) {
          setActiveHash(`#${nextActiveEntry.target.id}`)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        className={`${cn.headerWrap} ${isScrolled ? cn.headerWrapScrolled : ''}`}
      >
        <header className={cn.header}>
          <div className={cn.inner}>
            <div className={cn.headerInner}>
              <button
                type="button"
                className={cn.menuBtn}
                aria-expanded={drawerOpen}
                aria-controls="landing-nav-drawer"
                onClick={onToggleDrawer}
              >
                <img
                  src={LANDING_ASSETS.menuIcon}
                  alt=""
                  width={24}
                  height={24}
                  className={cn.menuIcon}
                  decoding="async"
                />
                <span className={cn.srOnly}>Menyu</span>
              </button>
              <Link to="/" className={cn.logoRow}>
                <img
                  src={LANDING_ASSETS.logoMark}
                  alt=""
                  className={cn.logoMark}
                  width={48}
                  height={48}
                  decoding="async"
                />
                <span className={cn.logoText}>Anor Donate</span>
              </Link>

              <nav className={cn.nav} aria-label="Asosiy">
                {NAV_ITEMS.map((item) => {
                  const active = activeHash === item.href

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`${cn.navLink} ${active ? cn.navLinkActive : ''}`}
                      aria-current={active ? 'location' : undefined}
                      onClick={(e) => {
                        setActiveHash(item.href)
                        onNavClick(e, item.href)
                      }}
                    >
                      {item.label}
                    </a>
                  )
                })}
              </nav>

              <div className={cn.headerActions}>
                <Link
                  to="/sign-in"
                  className={`${cn.btnPrimary} ${cn.btnPrimaryWide}`}
                >
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div
        className={`${cn.drawerBackdrop} ${drawerOpen ? cn.open : ''}`}
        aria-hidden={!drawerOpen}
        onClick={onCloseDrawer}
      />
      <aside
        id="landing-nav-drawer"
        className={`${cn.drawer} ${drawerOpen ? cn.open : ''}`}
        aria-hidden={!drawerOpen}
      >
        <nav className={cn.drawerNav} aria-label="Mobil menyu">
          {NAV_ITEMS.map((item) => {
            const active = activeHash === item.href

            return (
              <a
                key={item.href}
                href={item.href}
                className={`${cn.drawerNavLink} ${active ? cn.drawerNavLinkActive : ''}`}
                aria-current={active ? 'location' : undefined}
                onClick={(e) => {
                  setActiveHash(item.href)
                  onNavClick(e, item.href)
                }}
              >
                {item.label}
              </a>
            )
          })}
          <Link to="/sign-in" onClick={onCloseDrawer}>
            Kirish
          </Link>
        </nav>
      </aside>
    </>
  )
}
