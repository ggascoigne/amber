import { useEffect, useRef } from 'react'

import { loadStripe, Stripe } from '@stripe/stripe-js'
import { atom, useAtom } from 'jotai'

const stripePromiseAtom = atom<Promise<Stripe | null> | null>(null)
const baseUrlAtom = atom<string | null>(null)

export const useInitializeStripe = () => {
  const [, setStripePromise] = useAtom(stripePromiseAtom)
  const [, setBaseUrl] = useAtom(baseUrlAtom)
  const isCalledRef = useRef(false)

  useEffect(() => {
    if (!isCalledRef.current) {
      isCalledRef.current = true
      fetch('/api/stripe/getConfig').then(async (r) => {
        const { publishableKey, baseUrl } = await r.json()
        setStripePromise(loadStripe(publishableKey!)!)
        setBaseUrl(baseUrl)
      })
    }
  }, [setBaseUrl, setStripePromise])
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
