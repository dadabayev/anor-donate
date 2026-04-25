import cn from './admin-sidebar.module.css'

import {
  ADMIN_GO_TO_SITE,
  ADMIN_LOGOUT,
  ADMIN_PRIMARY_NAV,
} from '../model/navigation-items'
import { Image } from '@mantine/core'
import { performLogout } from '@shared/api'
import { ASSETS } from '@shared/constants'
import { clearAuthSession } from '@shared/lib'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const isAdminNavActive = (path: string, pathname: string) => {
  const normalized =
    pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname

  if (path === '/admin') {
    return normalized === '/admin'
  }

  return normalized === path || normalized.startsWith(`${path}/`)
}

export const AdminSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const handleLogout = async () => {
    await performLogout()
    clearAuthSession()
    navigate('/sign-in', { replace: true })
  }

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

      <nav className={cn.nav} aria-label={t('admin.nav.mainAria')}>
        {ADMIN_PRIMARY_NAV.map((item) => {
          const Icon = item.icon
          const active = isAdminNavActive(item.path, pathname)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={classNames(cn.item, cn.link, active && cn.itemActive)}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn.icon} size={20} stroke={2} />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <footer className={cn.footer} aria-label={t('admin.nav.footerAria')}>
        <Link to="/dashboard" className={classNames(cn.item, cn.link)}>
          <ADMIN_GO_TO_SITE.icon className={cn.icon} size={20} stroke={2} />
          <span>{t(ADMIN_GO_TO_SITE.labelKey)}</span>
        </Link>
        <hr className={cn.divider} />
        <button
          className={classNames(cn.item, cn.logout)}
          type={'button'}
          onClick={handleLogout}
        >
          <ADMIN_LOGOUT.icon className={cn.icon} size={20} stroke={2} />
          <span>{t(ADMIN_LOGOUT.labelKey)}</span>
        </button>
      </footer>
    </aside>
  )
}
