import { useCallback, useEffect, useState } from 'react'

import type { PaymentIntentRecord } from '@amber/client'
import { useTRPC } from '@amber/client'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { PaymentElement, useElements } from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query'
import Router from 'next/router'

import type { UserPaymentDetails } from './PaymentInput'
import { PaymentInput } from './PaymentInput'

import { formatAmountForDisplay, formatAmountFromStripe, useGetBaseUrl, useGetStripe, useYearFilter } from '../../utils'

type ElementsFormProps = {
  paymentIntent?: PaymentIntentRecord | null
  userId: number
  onSubmit: () => void
}

export const ElementsForm: React.FC<ElementsFormProps> = ({ paymentIntent = null, userId, onSubmit }) => {
  const trpc = useTRPC()
  const defaultAmount = paymentIntent ? formatAmountFromStripe(paymentIntent.amount, paymentIntent.currency) : 100 // TODO change me
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

  const updatePaymentIntentMutation = useMutation(trpc.payments.updatePaymentIntent.mutationOptions())
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
    const total = value.reduce((prev, curr) => prev + curr.total, 0)
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
      onSubmit()
      e.preventDefault()
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return
      if (!elements) return
      setPaymentStatus({ status: 'processing' })

      // Create a PaymentIntent with the specified amount.
      try {
        await updatePaymentIntentMutation.mutateAsync({
          amount: input.total,
          metadata: {
            payments: JSON.stringify(payments.filter((payment) => payment.total > 0)),
            userId,
            year,
          },
          paymentIntentId: paymentIntent?.id ?? '',
        })
      } catch (error) {
        setPaymentStatus({ status: 'error' })
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred')
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
    [
      baseUrl,
      elements,
      input.cardholderName,
      input.total,
      onSubmit,
      paymentIntent,
      payments,
      stripe,
      updatePaymentIntentMutation,
      userId,
      year,
    ],
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
      <PaymentStatus status={paymentStatus.status} paymentIntentSecret={paymentIntent?.clientSecret} />
    </>
  )
}
