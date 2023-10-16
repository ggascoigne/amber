import { useState, useEffect, useRef } from 'react'

import { DialogContentText } from '@mui/material'
import { Elements } from '@stripe/react-stripe-js'
import { PaymentIntent } from '@stripe/stripe-js'
import { Loader, Page } from 'ui'

import { ElementsForm } from './ElementsForm'
import { fetchPostJSON } from './fetchUtils'

import { useGraphQL, GetUserByIdDocument } from '../../client'
import { ContactEmail } from '../../components'
import { useGetStripe, useUser } from '../../utils'

export const Payment: React.FC = () => {
  const [stripe] = useGetStripe()
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const user = useUser()
  const isCalledRef = useRef(false)
  const userData = useGraphQL(GetUserByIdDocument, { id: user?.userId ?? -1 })
  const amountOwed = userData?.data?.user?.amountOwed

  useEffect(() => {
    if (!isCalledRef.current) {
      isCalledRef.current = true
      fetchPostJSON('/api/stripe/paymentIntents', {
        amount: 10,
      }).then((data: PaymentIntent | null) => {
        setPaymentIntent(data)
      })
    }
  }, [setPaymentIntent])

  // console.log('Payment', { paymentIntent })

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
          <ElementsForm paymentIntent={paymentIntent} userId={user.userId} />
        </Elements>
      ) : (
        <Loader />
      )}
      {amountOwed ? (
        <>
          <DialogContentText sx={{ pt: 2 }}>
            Alternatively, write a check for <strong>${0 - amountOwed}</strong> made out to{' '}
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
