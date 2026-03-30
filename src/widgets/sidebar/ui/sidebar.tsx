import cn from './sidebar.module.css'

import {
  LOGOUT_ITEM,
  PRIMARY_ITEMS,
  SECONDARY_ITEMS,
} from '../model/navigation-items'
import { Image } from '@mantine/core'
import { ASSETS } from '@shared/constants'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'

const isNavItemActive = (path: string, pathname: string) => {
  if (path === '/donations/settings') {
    return false
  }
  if (path === '/donations') {
    return pathname === '/donations' || pathname === '/donations/settings'
  }
  if (path === '/profile') {
    return pathname === '/profile'
  }
  if (path === '/widgets') {
    return pathname === '/widgets' || pathname.startsWith('/widgets/')
  }
  if (path === '/dashboard') {
    return pathname === '/dashboard' || pathname === '/'
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

export const Sidebar = () => {
  const { pathname } = useLocation()

  return (
    <aside className={cn.container}>
      <header className={cn.header}>
        <Image className={cn.logo} src={ASSETS.LOGO} alt={'Anor Donate logo'} />
        <p className={cn.brand}>AndySmith</p>
      </header>

      <hr className={cn.divider} />

      <nav className={cn.nav} aria-label={'Main navigation'}>
        {PRIMARY_ITEMS.map((item, index) => {
          const Icon = item.icon

          if (item.path) {
            const active = isNavItemActive(item.path, pathname)

            return (
              <Link
                key={item.label}
                to={item.path}
                className={classNames(
                  cn.item,
                  active && cn.itemActive,
                  cn.link,
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn.icon} size={16} stroke={2} />
                <span>{item.label}</span>
              </Link>
            )
          }

          return (
            <button
              key={item.label}
              className={classNames(cn.item, index === 0 && cn.itemActive)}
              type={'button'}
            >
              <Icon className={cn.icon} size={16} stroke={2} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className={cn.spacer} />

      <nav className={cn.nav} aria-label={'Secondary navigation'}>
        {SECONDARY_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <button key={item.label} className={cn.item} type={'button'}>
              <Icon className={cn.icon} size={16} stroke={2} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <hr className={cn.divider} />

      <footer className={cn.footer}>
        <button className={classNames(cn.item, cn.logout)} type={'button'}>
          <LOGOUT_ITEM.icon className={cn.icon} size={16} stroke={2} />
          <span>{LOGOUT_ITEM.label}</span>
        </button>
      </footer>
    </aside>
  )
}
