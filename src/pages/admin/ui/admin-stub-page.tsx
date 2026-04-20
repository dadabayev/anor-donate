import cn from './admin-stub-page.module.css'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const slugToSectionKey = {
  moderation: 'moderation',
  tts: 'tts',
  'meme-categories': 'memeCategories',
  memes: 'memes',
  news: 'news',
} as const

type SectionSlug = keyof typeof slugToSectionKey

const isSectionSlug = (value: string): value is SectionSlug =>
  value in slugToSectionKey

export const AdminStubPage = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const titleKey = useMemo(() => {
    const slug = pathname.replace(/^\/admin\/?/, '').replace(/\/$/, '')
    if (!slug) {
      return null
    }
    if (!isSectionSlug(slug)) {
      return 'admin.sections.unknown' as const
    }
    return `admin.sections.${slugToSectionKey[slug]}` as const
  }, [pathname])

  if (!titleKey) {
    return null
  }

  return (
    <section className={cn.page}>
      <h1 className={cn.title}>{t(titleKey)}</h1>
      <p className={cn.hint}>{t('admin.sections.comingSoon')}</p>
    </section>
  )
}
