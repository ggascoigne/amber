import type { LookupFieldsFragment, LookupValuesFieldsFragment, Maybe } from '../../client'

export type LookupAndValues = { __typename: 'Lookup' } & {
  lookupValues: { __typename: 'LookupValuesConnection' } & {
    nodes: Array<Maybe<{ __typename: 'LookupValue' } & LookupValuesFieldsFragment>>
  }
} & LookupFieldsFragment
