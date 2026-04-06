const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const LANDING_ASSETS = {
  logoMark: asset('assets/landing/logo-mark.svg'),
  heroPomegranate: asset('assets/landing/hero-pomegranate.png'),
  heroPomegranateMobile: asset('assets/landing/hero-pomegranate-mobile.png'),
  bloggerAvatarA: asset('assets/landing/blogger-avatar-a.png'),
  bloggerAvatarB: asset('assets/landing/blogger-avatar-b.png'),
  linkIcon: asset('assets/landing/link-icon.svg'),
  menuIcon: asset('assets/landing/menu-icon.svg'),
} as const
