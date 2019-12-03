import * as React from 'react'

import { useLookupValuesQuery } from '../../../client/queries'
import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'
import { SelectField } from './SelectField'
import { TextFieldProps } from './TextField'

export interface LookupFieldProps extends TextFieldProps {
  realm: string
}

export const LookupField: React.ComponentType<LookupFieldProps> = props => {
  const { select, realm, ...rest } = props
  const { loading, error, data } = useLookupValuesQuery({ realm })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }
  const selectValues = data?.lookups?.edges[0]?.node?.lookupValues?.nodes.map(v => {
    return {
      value: v!.code,
      label: v!.value
    }
  })
  return <SelectField {...rest} selectValues={selectValues!} />
}

SelectField.displayName = 'SelectField'
