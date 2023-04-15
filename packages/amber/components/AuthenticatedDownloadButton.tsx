import React, { createRef, PropsWithChildren } from 'react'

import { Button } from '@mui/material'
import { useNotification } from 'ui'

export const AuthenticatedDownloadButton: React.FC<PropsWithChildren<{ url: string; filename: string }>> = ({
  url,
  filename,
  children,
}) => {
  const link = createRef<any>()
  const notify = useNotification()

  const handleAction = async () => {
    if (!link.current || link.current.href) {
      return
    }

    const result = await fetch(url, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })

    if (result.status !== 200) {
      const json = await result.json()
      notify({ text: json.error, variant: 'error' })
    } else {
      const blob = await result.blob()
      const href = window.URL.createObjectURL(blob)

      link.current.download = filename
      link.current.href = href

      link.current.click()
    }
  }

  return (
    <>
      <Button onClick={handleAction} color='primary' variant='outlined'>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
        <a role='button' ref={link} />
        {children}
      </Button>
    </>
  )
}
