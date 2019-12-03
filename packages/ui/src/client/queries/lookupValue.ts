import { createLookupValue, createLookupValueVariables } from '__generated__/createLookupValue'
import { deleteLookupValue, deleteLookupValueVariables } from '__generated__/deleteLookupValue'
import { GetLookups_lookups_edges_node_lookupValues_nodes } from '__generated__/GetLookups'
import { GetLookupValue, GetLookupValueVariables } from '__generated__/GetLookupValue'
import { updateLookupValueByNodeId, updateLookupValueByNodeIdVariables } from '__generated__/updateLookupValueByNodeId'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { LOOKUP_FRAGMENT, LOOKUP_VALUES_FRAGMENT } from 'client'
import gql from 'graphql-tag'

import { GetLookupValuesVariables } from '../../__generated__/GetLookupValues'
import { QUERY_LOOKUP } from './lookup'

const useUpdateLookupValue = () =>
  useMutation<updateLookupValueByNodeId, updateLookupValueByNodeIdVariables>(gql`
    mutation updateLookupValueByNodeId($input: UpdateLookupValueByNodeIdInput!) {
      updateLookupValueByNodeId(input: $input) {
        lookupValue {
          ...lookupValuesFields
        }
      }
    }
    ${LOOKUP_VALUES_FRAGMENT}
  `)

const useCreateLookupValue = () =>
  useMutation<createLookupValue, createLookupValueVariables>(
    gql`
      mutation createLookupValue($input: CreateLookupValueInput!) {
        createLookupValue(input: $input) {
          lookupValue {
            ...lookupValuesFields
          }
        }
      }
      ${LOOKUP_VALUES_FRAGMENT}
    `,
    { refetchQueries: [{ query: QUERY_LOOKUP }] }
  )

export const useCreateOrUpdateLookupValue = () => {
  const [updateLookupValue] = useUpdateLookupValue()
  const [createLookupValue] = useCreateLookupValue()

  return (value: GetLookups_lookups_edges_node_lookupValues_nodes, lookupId: number) => {
    if (value.nodeId) {
      return updateLookupValue({
        variables: {
          input: {
            nodeId: value.nodeId,
            patch: {
              code: value.code,
              sequencer: value.sequencer,
              value: value.value,
              lookupId: lookupId
            }
          }
        }
      })
    } else {
      return createLookupValue({
        variables: {
          input: {
            lookupValue: {
              code: value.code,
              sequencer: value.sequencer,
              value: value.value,
              lookupId: lookupId,
              numericSequencer: 0.0,
              stringSequencer: '_'
            }
          }
        }
      })
    }
  }
}

export const useDeleteLookupValue = () =>
  useMutation<deleteLookupValue, deleteLookupValueVariables>(
    gql`
      mutation deleteLookupValue($input: DeleteLookupValueInput!) {
        deleteLookupValue(input: $input) {
          clientMutationId
          deletedLookupValueNodeId
        }
      }
    `,
    { refetchQueries: [{ query: QUERY_LOOKUP }] }
  )

const QUERY_LOOKUP_VALUE = gql`
  query GetLookupValue($realm: String!, $code: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          ...lookupFields
          lookupValues(condition: { code: $code }) {
            nodes {
              ...lookupValuesFields
            }
          }
        }
      }
    }
  }
  ${LOOKUP_FRAGMENT}
  ${LOOKUP_VALUES_FRAGMENT}
`

export const useLookupValueQuery = (variables: GetLookupValueVariables) =>
  useQuery<GetLookupValue, GetLookupValueVariables>(QUERY_LOOKUP_VALUE, { variables })

const QUERY_LOOKUP_VALUES = gql`
  query GetLookupValues($realm: String!) {
    lookups(condition: { realm: $realm }) {
      edges {
        node {
          ...lookupFields
          lookupValues(orderBy: VALUE_ASC) {
            nodes {
              ...lookupValuesFields
            }
          }
        }
      }
    }
  }
  ${LOOKUP_FRAGMENT}
  ${LOOKUP_VALUES_FRAGMENT}
`

export const useLookupValuesQuery = (variables: GetLookupValuesVariables) =>
  useQuery<GetLookupValue, GetLookupValuesVariables>(QUERY_LOOKUP_VALUES, { variables })
