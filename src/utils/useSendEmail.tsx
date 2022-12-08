import fetch from 'isomorphic-fetch'
import { useCallback } from 'react'
import { useNotification } from '@/components/Notifications'

import { EmailConfirmation } from './apiTypes'

interface SendEmail {
  (p: EmailConfirmation): void
}

export const useSendEmail = (): SendEmail => {
  const notify = useNotification()

  return useCallback(
    ({ type, body }: EmailConfirmation) => {
      fetch(`${window.location.origin}/api/send/${type}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.text())
        .then((responseBody) => {
          try {
            const result = JSON.parse(responseBody)
            if (result.messageId) {
              return undefined
            }
            if (result.status && result.status !== 200) {
              notify({
                text: `${result.status}: ${result.error}`,
                variant: 'error',
              })
            } else {
              console.log(`result = ${JSON.stringify(result, null, 2)}`)
            }
          } catch (e: any) {
            console.log(e)
            notify({
              text: e,
              variant: 'error',
            })
            return responseBody
          }
          return undefined
        })
    },
    [notify]
  )
}
