import cn from './edit-user-modal.module.css'

import type { AdminBloggerRow } from '../model/admin-bloggers'
import { channelSlugFromUrl } from '../model/channel-url'
import { Modal } from '@shared/ui'
import classNames from 'classnames'
import { useCallback, useId, useState } from 'react'

export interface EditUserModalLabels {
  title: string
  close: string
  save: string
  firstName: string
  username: string
  channelName: string
  channelUrl: string
  email: string
  channelAbout: string
  password: string
}

interface EditUserModalProps {
  user: AdminBloggerRow | null
  labels: EditUserModalLabels
  onClose: () => void
  onSave: (user: AdminBloggerRow) => void
}

interface EditUserFormProps {
  formId: string
  user: AdminBloggerRow
  labels: EditUserModalLabels
  onSave: (user: AdminBloggerRow) => void
}

const EditUserForm = ({
  formId,
  user,
  labels,
  onSave,
}: Readonly<EditUserFormProps>) => {
  const [fullName, setFullName] = useState(user.fullName)
  const [username, setUsername] = useState(user.username)
  const [channelName, setChannelName] = useState(user.channelName)
  const [channelUrl, setChannelUrl] = useState(user.channelUrl)
  const [email, setEmail] = useState(user.email)
  const [channelAbout, setChannelAbout] = useState(user.channelAbout)
  const [passwordDisplay, setPasswordDisplay] = useState(user.passwordDisplay)

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void }) => {
      event.preventDefault()
      const channel = channelSlugFromUrl(channelUrl)
      onSave({
        ...user,
        fullName: fullName.trim(),
        username: username.trim(),
        nickname: username.trim(),
        channelName: channelName.trim(),
        channelUrl: channelUrl.trim(),
        channel: channel || user.channel,
        email: email.trim(),
        channelAbout: channelAbout.trim(),
        passwordDisplay,
      })
    },
    [
      user,
      fullName,
      username,
      channelName,
      channelUrl,
      email,
      channelAbout,
      passwordDisplay,
      onSave,
    ],
  )

  return (
    <form id={formId} className={cn.form} onSubmit={handleSubmit} noValidate>
      <div className={cn.grid}>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-fullName`}>
            {labels.firstName}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-fullName`}
              className={cn.input}
              name="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
              }}
              autoComplete="name"
            />
          </div>
        </div>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-username`}>
            {labels.username}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-username`}
              className={cn.input}
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              autoComplete="username"
            />
          </div>
        </div>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-channelName`}>
            {labels.channelName}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-channelName`}
              className={cn.input}
              name="channelName"
              value={channelName}
              onChange={(e) => {
                setChannelName(e.target.value)
              }}
              autoComplete="organization"
            />
          </div>
        </div>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-channelUrl`}>
            {labels.channelUrl}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-channelUrl`}
              className={cn.input}
              name="channelUrl"
              value={channelUrl}
              onChange={(e) => {
                setChannelUrl(e.target.value)
              }}
              autoComplete="url"
              inputMode="url"
            />
          </div>
        </div>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-email`}>
            {labels.email}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-email`}
              className={cn.input}
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              autoComplete="email"
            />
          </div>
        </div>
        <div className={cn.field}>
          <label className={cn.label} htmlFor={`${formId}-channelAbout`}>
            {labels.channelAbout}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-channelAbout`}
              className={cn.input}
              name="channelAbout"
              value={channelAbout}
              onChange={(e) => {
                setChannelAbout(e.target.value)
              }}
            />
          </div>
        </div>
        <div className={classNames(cn.field, cn.fieldFull)}>
          <label className={cn.label} htmlFor={`${formId}-password`}>
            {labels.password}
          </label>
          <div className={cn.inputShell}>
            <input
              id={`${formId}-password`}
              className={cn.input}
              name="password"
              type="password"
              value={passwordDisplay}
              onChange={(e) => {
                setPasswordDisplay(e.target.value)
              }}
              autoComplete="new-password"
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export const EditUserModal = ({
  user,
  labels,
  onClose,
  onSave,
}: Readonly<EditUserModalProps>) => {
  const formId = useId()

  if (!user) {
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
        <button type="submit" form={formId} className={cn.saveButton}>
          {labels.save}
        </button>
      }
    >
      <EditUserForm
        key={user.id}
        formId={formId}
        user={user}
        labels={labels}
        onSave={onSave}
      />
    </Modal>
  )
}
