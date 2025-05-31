import { useState, useEffect, useRef, useCallback } from 'react'

import { useTRPC } from '@amber/client'
import { DialogContentText } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentIntent } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'
import { Loader, Page } from 'ui'

import { ElementsForm } from './ElementsForm'
import { fetchPostJSON } from './fetchUtils'

import { ContactEmail } from '../../components'
import { useGetStripe, useConfiguration, useUser } from '../../utils'

export const Payment: React.FC = () => {
  const trpc = useTRPC()
  const [stripe] = useGetStripe()
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const user = useUser()
  const paymentStateRef = useRef<'empty' | 'created' | 'submitted'>('empty')
  const userData = useQuery(trpc.users.getUser.queryOptions({ id: user?.userId ?? -1 }))
  const balance = userData?.data?.balance ?? 0

  useEffect(() => {
    if (paymentStateRef.current === 'empty') {
      paymentStateRef.current = 'created'
      fetchPostJSON('/api/stripe/paymentIntents', {
        action: 'create',
        amount: 10,
      }).then((data: PaymentIntent | null) => {
        setPaymentIntent(data)
      })
    }
    return () => {
      if (paymentStateRef.current === 'created' && paymentIntent) {
        fetchPostJSON('/api/stripe/paymentIntents', {
          action: 'cancel',
          payment_intent_id: paymentIntent?.id,
        })
      }
    }
  }, [paymentIntent, setPaymentIntent])

  // console.log('Payment', { paymentIntent })

  const configuration = useConfiguration()
  const acus = configuration.numberOfSlots === 8
  const acnw = !acus

  const onSubmit = useCallback(() => {
    paymentStateRef.current = 'submitted'
  }, [])

  return (
    <Page title='Make Payment'>
      {stripe && paymentIntent?.client_secret && user.userId ? (
        <Elements
          stripe={stripe}
          options={{
            appearance: {
              variables: {
                // colorIcon: '#6772e5',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              },
            },
            clientSecret: paymentIntent.client_secret,
          }}
        >
          <ElementsForm paymentIntent={paymentIntent} userId={user.userId} onSubmit={onSubmit} />
        </Elements>
      ) : (
        <Loader />
      )}
      {acnw && balance < 0 ? (
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
