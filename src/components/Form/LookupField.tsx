import React from 'react'
import { useGetLookupValuesQuery } from '@/client'

import { getRealmOptions } from '../../utils'
import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'
import { SelectField } from './SelectField'
import type { TextFieldProps } from './TextField'

export interface LookupFieldProps extends TextFieldProps {
  realm: string
}

export const LookupField: React.ComponentType<LookupFieldProps> = (props) => {
  const { select, realm, ...rest } = props
  const options = getRealmOptions(realm)
  const { isLoading, error, data } = useGetLookupValuesQuery(
    { realm },
    {
      staleTime: 10 * 60 * 1000,
      enabled: !options,
    }
  )
  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading && !options) {
    return <Loader />
  }
  if (options) {
    return <SelectField {...rest} selectValues={options} />
  }
  const selectValues = data?.lookups?.edges[0]?.node?.lookupValues.nodes.map((v) => ({
    value: v!.code,
    text: v!.value,
  }))
  return <SelectField {...rest} selectValues={selectValues} />
}

LookupField.displayName = 'LookupField'
