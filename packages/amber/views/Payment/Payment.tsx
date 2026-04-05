import { useState, useEffect, useRef, useCallback } from 'react'

import type { PaymentIntentRecord } from '@amber/client'
import { useTRPC } from '@amber/client'
import { Loader, useNotification } from '@amber/ui'
import { DialogContentText } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { ElementsForm } from './ElementsForm'

import { Page, ContactEmail } from '../../components'
import { useGetStripe, useConfiguration, useInitializeStripe, useUser } from '../../utils'

export const Payment = () => {
  const trpc = useTRPC()
  useInitializeStripe()
  const notify = useNotification()
  const [stripe] = useGetStripe()
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentRecord | null>(null)
  const user = useUser()
  const paymentIntentRef = useRef<PaymentIntentRecord | null>(null)
  const paymentStateRef = useRef<'empty' | 'created' | 'submitted'>('empty')
  const createPaymentIntentMutation = useMutation(trpc.payments.createPaymentIntent.mutationOptions())
  const cancelPaymentIntentMutation = useMutation(trpc.payments.cancelPaymentIntent.mutationOptions())
  const createPaymentIntentMutationRef = useRef(createPaymentIntentMutation)
  const cancelPaymentIntentMutationRef = useRef(cancelPaymentIntentMutation)
  const notifyRef = useRef(notify)
  const userData = useQuery(trpc.users.getUser.queryOptions({ id: user?.userId ?? -1 }))
  const balance = userData?.data?.balance ?? 0

  useEffect(() => {
    createPaymentIntentMutationRef.current = createPaymentIntentMutation
  }, [createPaymentIntentMutation])

  useEffect(() => {
    cancelPaymentIntentMutationRef.current = cancelPaymentIntentMutation
  }, [cancelPaymentIntentMutation])

  useEffect(() => {
    notifyRef.current = notify
  }, [notify])

  useEffect(() => {
    if (paymentStateRef.current === 'empty') {
      let isCancelled = false
      paymentStateRef.current = 'created'
      createPaymentIntentMutationRef.current
        .mutateAsync({
          amount: 10,
        })
        .then((result) => {
          if (isCancelled) {
            cancelPaymentIntentMutationRef.current.mutate({
              paymentIntentId: result.id,
            })
            return
          }

          paymentIntentRef.current = result
          setPaymentIntent(result)
        })
        .catch((error) => {
          paymentStateRef.current = 'empty'
          notifyRef.current({
            text: error.message,
            variant: 'error',
          })
        })

      return () => {
        isCancelled = true
        if (paymentStateRef.current === 'created' && paymentIntentRef.current) {
          cancelPaymentIntentMutationRef.current.mutate({
            paymentIntentId: paymentIntentRef.current.id,
          })
        } else {
          paymentStateRef.current = 'empty'
        }
      }
    }
    return undefined
  }, [])

  // console.log('Payment', { paymentIntent })

  const configuration = useConfiguration()

  const onSubmit = useCallback(() => {
    paymentStateRef.current = 'submitted'
  }, [])

  return (
    <Page title='Make Payment'>
      {stripe && paymentIntent?.clientSecret && user.userId ? (
        <Elements
          stripe={stripe}
          options={{
            appearance: {
              variables: {
                // colorIcon: '#6772e5',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              },
            },
            clientSecret: paymentIntent.clientSecret,
          }}
        >
          <ElementsForm paymentIntent={paymentIntent} userId={user.userId} onSubmit={onSubmit} />
        </Elements>
      ) : (
        <Loader />
      )}
      {configuration.isAcnw && balance < 0 ? (
        <>
          <DialogContentText sx={{ pt: 2 }}>
            Alternatively, write a check for <strong>${Math.max(0 - balance, 0)}</strong> made out to{' '}
            <strong>AmberCon NorthWest Inc</strong>, and send to:
          </DialogContentText>
          <DialogContentText sx={{ pl: 2 }}>
            AmberCon NorthWest Inc
            <br />
            1914 SE 24th Ave
            <br />
            Portland OR 97214
          </DialogContentText>
        </>
      ) : null}
      <DialogContentText>
        If you need to contact the organizers, do so at <ContactEmail />
      </DialogContentText>
    </Page>
  )
}
