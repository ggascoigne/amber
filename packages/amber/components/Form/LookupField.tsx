import type React from 'react'

import { useTRPC } from '@amber/client'
import type { TextFieldProps } from '@amber/ui'
import { Loader, SelectField } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { useRealmOptions } from '../../utils'
import { TransportError } from '../TransportError'

export interface LookupFieldProps extends TextFieldProps {
  realm: string
}

export const LookupField: React.ComponentType<LookupFieldProps> = (props) => {
  const { select: _select, realm, ...rest } = props
  const options = useRealmOptions(realm)
  const trpc = useTRPC()
  const { isLoading, error, data } = useQuery(
    trpc.lookups.getLookupValues.queryOptions(
      { realm },
      {
        staleTime: 10 * 60 * 1000,
        enabled: !options,
      },
    ),
  )
  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading && !options) {
    return <Loader />
  }
  if (options) {
    return <SelectField {...rest} selectValues={options} />
  }
  const selectValues = data?.[0]?.lookupValue.map((v) => ({
    value: v!.code,
    text: v!.value,
  }))
  return <SelectField {...rest} selectValues={selectValues} />
}

LookupField.displayName = 'LookupField'
