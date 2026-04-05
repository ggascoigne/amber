import { useCallback } from 'react'

import { useTRPC } from '@amber/client'
import type { SendEmailInput } from '@amber/server/src/api/contracts/email'
import { isDev, useNotification } from '@amber/ui'
import { useMutation } from '@tanstack/react-query'

type SendEmail = (input: SendEmailInput) => void

export const useSendEmail = (): SendEmail => {
  const trpc = useTRPC()
  const notify = useNotification()
  const sendEmailMutation = useMutation(trpc.email.send.mutationOptions())

  return useCallback(
    (input: SendEmailInput) => {
      sendEmailMutation.mutate(input, {
        onError: (error) => {
          console.log(error)
          notify({
            text: error.message,
            variant: 'error',
          })
        },
        onSuccess: (result) => {
          if (isDev) {
            console.log(`result = ${JSON.stringify(result, null, 2)}`)
          }
        },
      })
    },
    [notify, sendEmailMutation],
  )
}
