import React from 'react'

import { useTRPC } from '@amber/client'
import { Loader, RadioGroupFieldWithLabel, RadioGroupProps } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { TransportError } from '../TransportError'

export interface LookupRadioFieldProps extends RadioGroupProps {
  realm: string
}

export const LookupRadioField: React.ComponentType<LookupRadioFieldProps> = (props) => {
  const { realm, ...rest } = props
  const trpc = useTRPC()

  const { isLoading, error, data } = useQuery(
    trpc.lookups.getLookupValues.queryOptions(
      { realm },
      {
        staleTime: 10 * 60 * 1000,
      },
    ),
  )
  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading) {
    return <Loader />
  }
  const selectValues = data?.[0]?.lookupValue.map((v) => ({
    value: v!.code,
    text: v!.value,
  }))
  return <RadioGroupFieldWithLabel selectValues={selectValues} {...rest} />
}

LookupRadioField.displayName = 'LookupRadioField'
