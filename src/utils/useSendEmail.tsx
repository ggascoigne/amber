import fetch from 'isomorphic-fetch'
import { useCallback } from 'react'

import { useToken } from '../components/Acnw/Auth/Auth0'
import { useNotification } from '../components/Acnw/Notifications'

export const useSendEmail = () => {
  const [jwtToken] = useToken()
  const [notify] = useNotification()

  return [
    useCallback(
      ({ type, body }: { type: string; body: string }) => {
        fetch(window.location.origin + `/api/send/${type}`, {
          method: 'post',
          headers: jwtToken
            ? {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
              }
            : {
                'Content-Type': 'application/json',
              },
          body,
        })
          .then((response) => response.text())
          .then((responseBody) => {
            try {
              const result = JSON.parse(responseBody)
              if (result.messageId) {
                return
              } else {
                if (result.status && result.status !== 200) {
                  notify({
                    text: `${result.status}: ${result.error}`,
                    variant: 'error',
                  })
                } else {
                  console.log(`result = ${JSON.stringify(result, null, 2)}`)
                }
              }
            } catch (e) {
              console.log(e)
              notify({
                text: e,
                variant: 'error',
              })
              return responseBody
            }
          })
      },
      [notify, jwtToken]
    ),
  ]
}
