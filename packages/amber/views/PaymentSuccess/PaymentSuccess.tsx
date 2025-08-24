import { useEffect, useState } from 'react'

import { useInvalidatePaymentQueries, useTRPC } from '@amber/client'
import { Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Page } from 'ui/components'

import { formatAmountFromStripe, useGetStripe, useInitializeStripe, formatAmountForDisplay, useUser } from '../../utils'

export const PaymentSuccess = () => {
  const trpc = useTRPC()
  useInitializeStripe()
  const [stripe] = useGetStripe()
  const [amount, setAmount] = useState(0)
  const router = useRouter()
  const paymentIntentSecret = router.query.paymentIntentSecret as string
  const refresh = useInvalidatePaymentQueries()
  const user = useUser()
  const data = useQuery(
    trpc.users.getUser.queryOptions(
      { id: user.userId! },
      {
        refetchInterval: 10_000,
      },
    ),
  )
  const balance = data?.data?.balance

  useEffect(() => {
    if (stripe) {
      Promise.allSettled([stripe!.retrievePaymentIntent(paymentIntentSecret!)]).then((res) => {
        if (res[0].status === 'fulfilled') {
          // console.log(res[0].value)
          setAmount(formatAmountFromStripe(res[0].value?.paymentIntent?.amount ?? 0))
          refresh()
        }
      })
    }
  }, [paymentIntentSecret, refresh, stripe])

  return (
    <Page title='Payment Successful'>
      <Typography>Thank you. Your payment of {formatAmountForDisplay(amount)} has been received.</Typography>
      <Typography>Your balance is {formatAmountForDisplay(balance ?? 0)}</Typography>
    </Page>
  )
}
