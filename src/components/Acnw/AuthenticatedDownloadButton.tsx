import { Button } from '@material-ui/core'
import React, { createRef } from 'react'

import { useToken } from './Auth/Auth0'
import { useNotification } from './Notifications'

export const AuthenticatedDownloadButton: React.FC<{ url: string; filename: string }> = ({
  url,
  filename,
  children,
}) => {
  const [jwtToken] = useToken()
  const link = createRef<any>()
  const [notify] = useNotification()

  const handleAction = async () => {
    if (!link.current || link.current.href) {
      return
    }

    const result = await fetch(url, {
      headers: jwtToken
        ? {
            'Content-Type': 'application/octet-stream',
            Authorization: `Bearer ${jwtToken}`,
          }
        : {
            'Content-Type': 'application/octet-stream',
          },
    })

    console.log(`result.status = ${JSON.stringify(result.status, null, 2)}`)

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
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a role='button' ref={link} />
        {children}
      </Button>
    </>
  )
}
