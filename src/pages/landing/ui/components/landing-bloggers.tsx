import cn from '../landing-page.module.css'

import { LANDING_ASSETS } from '../landing-assets'
import { IconChevronDown } from '@tabler/icons-react'

const BLOGGER_CARDS = [
  { avatar: LANDING_ASSETS.bloggerAvatarB },
  { avatar: LANDING_ASSETS.bloggerAvatarA },
  { avatar: LANDING_ASSETS.bloggerAvatarB },
  { avatar: LANDING_ASSETS.bloggerAvatarA },
] as const

export const LandingBloggers = () => (
  <section
    id="bloggers"
    className={cn.bloggers}
    aria-labelledby="bloggers-title"
  >
    <div className={cn.inner}>
      <h2 id="bloggers-title" className={cn.bloggersTitle}>
        <span className={cn.bloggersTitleLine1}>Anor Donate</span>
        <span className={cn.bloggersTitleLine2}>
          dan foydalanadigan blogerlar
        </span>
      </h2>
      <div className={cn.bloggersGrid}>
        {BLOGGER_CARDS.map((card, index) => (
          <article key={index} className={cn.bloggerCard}>
            <div className={cn.bloggerPhoto}>
              <span>Photo</span>
            </div>
            <div className={cn.bloggerMeta}>
              <div className={cn.bloggerAvatar}>
                <img
                  src={card.avatar}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className={cn.bloggerName}>Nickname</p>
              <IconChevronDown
                size={24}
                stroke={1.75}
                className={cn.chevronGo}
                aria-hidden
              />
              <div className={cn.bloggerLinkRow}>
                <img
                  src={LANDING_ASSETS.linkIcon}
                  alt=""
                  className={cn.linkIcon}
                  width={24}
                  height={24}
                  loading="lazy"
                  decoding="async"
                />
                <p className={cn.bloggerLink}>Link</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)
