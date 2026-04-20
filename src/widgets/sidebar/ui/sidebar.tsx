import cn from './sidebar.module.css'

import {
  LOGOUT_NAV_KEY,
  PRIMARY_NAV_KEYS,
  SECONDARY_NAV_KEYS,
} from '../model/navigation-items'
import { Image } from '@mantine/core'
import { ASSETS } from '@shared/constants'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

const isNavItemActive = (path: string, pathname: string) => {
  if (path === '/donations/settings') {
    return false
  }
  if (path === '/donations') {
    return pathname === '/donations' || pathname === '/donations/settings'
  }
  if (path === '/profile') {
    return pathname === '/profile' || pathname.startsWith('/profile/')
  }
  if (path === '/widgets') {
    return pathname === '/widgets' || pathname.startsWith('/widgets/')
  }
  if (path === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/'
  }
  if (path === '/admin') {
    return pathname === '/admin' || pathname.startsWith('/admin/')
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

export const Sidebar = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <aside className={cn.container}>
      <header className={cn.header}>
        <Image
          className={cn.logo}
          src={ASSETS.LOGO}
          alt={t('sidebar.logoAlt')}
        />
        <p className={cn.brand}>{t('sidebar.brandPlaceholder')}</p>
      </header>

      <hr className={cn.divider} />

      <nav className={cn.nav} aria-label={t('sidebar.mainNavAria')}>
        {PRIMARY_NAV_KEYS.map((item, index) => {
          const Icon = item.icon

          if (item.path) {
            const active = isNavItemActive(item.path, pathname)

            return (
              <Link
                key={item.labelKey}
                to={item.path}
                className={classNames(
                  cn.item,
                  active && cn.itemActive,
                  cn.link,
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn.icon} size={16} stroke={2} />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          }

          return (
            <button
              key={item.labelKey}
              className={classNames(cn.item, index === 0 && cn.itemActive)}
              type={'button'}
            >
              <Icon className={cn.icon} size={16} stroke={2} />
              <span>{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      <div className={cn.spacer} />

      <nav className={cn.nav} aria-label={t('sidebar.secondaryNavAria')}>
        {SECONDARY_NAV_KEYS.map((item) => {
          const Icon = item.icon

          if (item.path) {
            const active = isNavItemActive(item.path, pathname)

            return (
              <Link
                key={item.labelKey}
                to={item.path}
                className={classNames(
                  cn.item,
                  active && cn.itemActive,
                  cn.link,
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn.icon} size={16} stroke={2} />
                <span>{t(item.labelKey)}</span>
              </Link>
            )
          }

          return (
            <button key={item.labelKey} className={cn.item} type={'button'}>
              <Icon className={cn.icon} size={16} stroke={2} />
              <span>{t(item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      <hr className={cn.divider} />

      <footer className={cn.footer}>
        <button className={classNames(cn.item, cn.logout)} type={'button'}>
          <LOGOUT_NAV_KEY.icon className={cn.icon} size={16} stroke={2} />
          <span>{t(LOGOUT_NAV_KEY.labelKey)}</span>
        </button>
      </footer>
    </aside>
  )
}
