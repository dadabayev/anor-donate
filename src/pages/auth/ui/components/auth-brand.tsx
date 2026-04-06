import cn from '../auth-page.module.css'

import { AUTH_ASSETS } from '../auth-assets'

export const AuthBrand = () => {
  return (
    <div className={cn.brand}>
      <img
        src={AUTH_ASSETS.logoMark}
        alt=""
        className={cn.brandMark}
        width={48}
        height={48}
        decoding="async"
      />
      <span className={cn.brandText}>Anor Donate</span>
    </div>
  )
}
