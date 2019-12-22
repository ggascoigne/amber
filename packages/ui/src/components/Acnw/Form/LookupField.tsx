import { useGetLookupValuesQuery } from 'client'
import * as React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'
import { SelectField } from './SelectField'
import { TextFieldProps } from './TextField'

export interface LookupFieldProps extends TextFieldProps {
  realm: string
}

export const LookupField: React.ComponentType<LookupFieldProps> = props => {
  const { select, realm, ...rest } = props
  const { loading, error, data } = useGetLookupValuesQuery({ variables: { realm } })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }
  const selectValues = data?.lookups?.edges[0]?.node?.lookupValues?.nodes.map(v => {
    return {
      value: v!.code,
      text: v!.value
    }
  })
  return <SelectField {...rest} selectValues={selectValues!} />
}

SelectField.displayName = 'SelectField'
