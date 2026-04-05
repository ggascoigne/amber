import { useEffect, useRef } from 'react'

import { useTRPC } from '@amber/client'
import type { Stripe } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'

const stripePromiseAtom = atom<Promise<Stripe | null> | null>(null)
const baseUrlAtom = atom<string | null>(null)

export const useInitializeStripe = () => {
  const trpc = useTRPC()
  const [, setStripePromise] = useAtom(stripePromiseAtom)
  const [, setBaseUrl] = useAtom(baseUrlAtom)
  const isCalledRef = useRef(false)
  const { data } = useQuery(
    trpc.payments.getConfig.queryOptions(undefined, {
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 60 * 60 * 1000,
    }),
  )

  useEffect(() => {
    if (!isCalledRef.current && data) {
      isCalledRef.current = true
      setStripePromise(loadStripe(data.publishableKey)!)
      setBaseUrl(data.baseUrl)
    }
  }, [data, setBaseUrl, setStripePromise])
}

export const useGetStripe = () => useAtom(stripePromiseAtom)
export const useGetBaseUrl = () => useAtom(baseUrlAtom)

export function formatAmountForDisplay(amount: number, currency = 'usd'): string {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
}

export function formatAmountFromStripe(amount: number, currency = 'usd'): number {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true

  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount / 100)
}
