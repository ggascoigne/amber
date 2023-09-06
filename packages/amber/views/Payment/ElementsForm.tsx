import { useCallback, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment/InputAdornment'
import TextField from '@mui/material/TextField'
import { PaymentElement, useElements } from '@stripe/react-stripe-js'
import { PaymentIntent } from '@stripe/stripe-js'
import Router from 'next/router'

import { fetchPostJSON } from './fetchUtils'
import { PaymentInput, UserPaymentDetails } from './PaymentInput'

import { formatAmountForDisplay, formatAmountFromStripe, useGetBaseUrl, useGetStripe, useYearFilter } from '../../utils'

// keep in sync with packages/api/src/stripe/types.ts
type ElementsFormProps = {
  paymentIntent?: PaymentIntent | null
  userId: number
}

export const ElementsForm: React.FC<ElementsFormProps> = ({ paymentIntent = null, userId }) => {
  const defaultAmount = paymentIntent ? formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency) : 100 // todo change me
  const [input, setInput] = useState({
    total: defaultAmount,
    cardholderName: '',
  })
  const [paymentType, setPaymentType] = useState('')
  const [paymentStatus, setPaymentStatus] = useState({ status: 'initial' })
  const [errorMessage, setErrorMessage] = useState('')
  const [payments, setPayments] = useState<UserPaymentDetails[]>([])
  const [baseUrl] = useGetBaseUrl()
  const [year] = useYearFilter()

  const [stripe] = useGetStripe()
  const elements = useElements()

  const PaymentStatus = ({ status, paymentIntentSecret }: { status: string; paymentIntentSecret?: string | null }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>

      case 'requires_action':
        return <h2>Authenticating...</h2>

      case 'succeeded':
        Router.push({
          pathname: '/payment-success',
          query: { paymentIntentSecret: paymentIntentSecret! },
        })
        return <h2>Success</h2>

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className='error-message'>{errorMessage}</p>
          </>
        )

      default:
        return null
    }
  }

  const setTotal = useCallback((value: UserPaymentDetails[]) => {
    const total = value.reduce((prev, curr) => prev + curr.amount ?? 0, 0)
    setInput((inp) => ({
      ...inp,
      total,
    }))
  }, [])

  useEffect(() => {
    setTotal(payments)
    // console.log({ payments })
  }, [setTotal, payments])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e?.currentTarget?.name
    const targetValue = e?.currentTarget?.value
    if (targetName) {
      setInput((inp) => ({
        ...inp,
        [targetName]: targetValue,
      }))
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return
      if (!elements) return
      setPaymentStatus({ status: 'processing' })

      // Create a PaymentIntent with the specified amount.
      const response = await fetchPostJSON('/api/stripe/paymentIntents', {
        amount: input.total,
        payment_intent_id: paymentIntent?.id,
        metadata: {
          userId,
          year,
          payments: JSON.stringify(payments.filter((p) => p.amount > 0)),
        },
      })
      setPaymentStatus(response)

      if (response.statusCode === 500) {
        setPaymentStatus({ status: 'error' })
        setErrorMessage(response.message)
        return
      }

      // Use your card Element with other Stripe.js APIs
      const confirmResult = await stripe!.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${baseUrl}/payment-success`,
          payment_method_data: {
            billing_details: {
              name: input.cardholderName,
            },
          },
        },
        redirect: 'if_required',
      })
      // console.log({ confirmResult })

      if (confirmResult.error) {
        setPaymentStatus({ status: 'error' })
        setErrorMessage(confirmResult.error.message ?? 'An unknown error occurred')
      } else if (confirmResult && paymentIntent) {
        setPaymentStatus(confirmResult.paymentIntent)
      }
    },
    [baseUrl, elements, input.cardholderName, input.total, paymentIntent, payments, stripe, userId, year],
  )

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PaymentInput userId={userId} name='payment' setPayments={setPayments} />
        <Box
          sx={{
            pb: 2,
          }}
        >
          <TextField
            id='total'
            label='Total Payment'
            variant='outlined'
            type='number'
            value={input.total}
            InputProps={{
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
              readOnly: true,
            }}
            sx={{
              pb: 4,
            }}
          />
          {paymentType === 'card' ? (
            <TextField
              placeholder='Cardholder name'
              type='Text'
              name='cardholderName'
              onChange={handleInputChange}
              required
              fullWidth
              variant='outlined'
              sx={{
                pb: 2,
              }}
            />
          ) : null}
          <div className='FormRow elements-style'>
            <PaymentElement
              onChange={(e) => {
                setPaymentType(e.value.type)
              }}
            />
          </div>
        </Box>
        <Button
          variant='contained'
          type='submit'
          disabled={!['initial', 'succeeded', 'error'].includes(paymentStatus.status) || !stripe}
        >
          Pay {formatAmountForDisplay(input.total)}
        </Button>
      </form>
      <PaymentStatus status={paymentStatus.status} paymentIntentSecret={paymentIntent?.client_secret} />
    </>
  )
}
