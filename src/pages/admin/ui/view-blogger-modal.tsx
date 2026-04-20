import cn from './view-blogger-modal.module.css'

import type { AdminBloggerRow } from '../model/admin-bloggers'
import { Modal } from '@shared/ui'

export interface ViewBloggerModalLabels {
  title: string
  close: string
  firstName: string
  username: string
  channelName: string
  channelUrl: string
  email: string
  channelAbout: string
  password: string
  back: string
}

interface ViewBloggerModalProps {
  blogger: AdminBloggerRow | null
  labels: ViewBloggerModalLabels
  onClose: () => void
}

export const ViewBloggerModal = ({
  blogger,
  labels,
  onClose,
}: Readonly<ViewBloggerModalProps>) => {
  if (!blogger) {
    return null
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={labels.title}
      closeAriaLabel={labels.close}
      width="lg"
      footer={
        <button type="button" className={cn.backButton} onClick={onClose}>
          {labels.back}
        </button>
      }
    >
      <div className={cn.body}>
        <div className={cn.grid}>
          <div className={cn.field}>
            <span className={cn.label}>{labels.firstName}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.fullName}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.field}>
            <span className={cn.label}>{labels.username}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.username}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.field}>
            <span className={cn.label}>{labels.channelName}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.channelName}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.field}>
            <span className={cn.label}>{labels.channelUrl}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.channelUrl}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.field}>
            <span className={cn.label}>{labels.email}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.email}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.field}>
            <span className={cn.label}>{labels.channelAbout}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                value={blogger.channelAbout}
                aria-readonly="true"
              />
            </div>
          </div>
          <div className={cn.fieldFull}>
            <span className={cn.label}>{labels.password}</span>
            <div className={cn.inputShell}>
              <input
                className={cn.input}
                readOnly
                autoComplete="off"
                value={blogger.passwordDisplay}
                aria-readonly="true"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
