import cn from './landing-page.module.css'

import {
  LandingAbout,
  LandingBloggers,
  LandingFaq,
  LandingFooter,
  LandingHeader,
  LandingHero,
} from './components'
import { useCallback, useState } from 'react'

export const LandingPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setDrawerOpen((open) => !open), [])

  return (
    <div className={cn.page}>
      <LandingHeader
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
        onCloseDrawer={closeDrawer}
      />

      <main id="top" className={cn.main}>
        <LandingHero />
        <LandingAbout />
        <LandingFaq />
        <LandingBloggers />
        <LandingFooter />
      </main>
    </div>
  )
}
