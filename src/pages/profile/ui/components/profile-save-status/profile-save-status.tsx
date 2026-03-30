import cn from './profile-save-status.module.css'

import { IconCircleCheckFilled, IconLoader2 } from '@tabler/icons-react'
import classNames from 'classnames'

type SaveState = 'idle' | 'saving' | 'success' | 'error'

interface ProfileSaveStatusProps {
  saveState: SaveState
  saveMessage: string
  savingLabel: string
}

export const ProfileSaveStatus = ({
  saveState,
  saveMessage,
  savingLabel,
}: Readonly<ProfileSaveStatusProps>) => {
  if (!saveMessage) {
    return null
  }

  return (
    <div className={cn.statusRow} aria-live="polite">
      <p
        className={classNames(
          cn.statusMessage,
          saveState === 'error' && cn.statusMessageError,
        )}
      >
        {saveState === 'saving' ? (
          <span
            style={{
              display: 'inline-flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <IconLoader2 size={16} className={cn.spin} />
            {savingLabel}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <IconCircleCheckFilled size={16} />
            {saveMessage}
          </span>
        )}
      </p>
    </div>
  )
}

export type { SaveState }
