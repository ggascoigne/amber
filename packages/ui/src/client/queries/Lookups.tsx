import { createLookup, createLookupVariables } from '__generated__/createLookup'
import { createLookupValue, createLookupValueVariables } from '__generated__/createLookupValue'
import { GetLookups_lookups_edges_node_lookupValues_nodes } from '__generated__/GetLookups'
import { updateLookupByNodeId, updateLookupByNodeIdVariables } from '__generated__/updateLookupByNodeId'
import { updateLookupValueByNodeId, updateLookupValueByNodeIdVariables } from '__generated__/updateLookupValueByNodeId'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

import { deleteLookup, deleteLookupVariables } from '../../__generated__/deleteLookup'
import { deleteLookupValue, deleteLookupValueVariables } from '../../__generated__/deleteLookupValue'
import { LOOKUP_FRAGMENT, LOOKUP_VALUES_FRAGMENT } from '../fragments'

export const QUERY_LOOKUP = gql`
  query GetLookups {
    lookups(orderBy: REALM_ASC) {
      edges {
        node {
          ...lookupFields
          lookupValues(orderBy: SEQUENCER_ASC) {
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

const useUpdateLookup = () =>
  useMutation<updateLookupByNodeId, updateLookupByNodeIdVariables>(gql`
    mutation updateLookupByNodeId($input: UpdateLookupByNodeIdInput!) {
      updateLookupByNodeId(input: $input) {
        lookup {
          ...lookupFields
        }
      }
    }
    ${LOOKUP_FRAGMENT}
  `)

const useCreateLookup = () =>
  useMutation<createLookup, createLookupVariables>(
    gql`
      mutation createLookup($input: CreateLookupInput!) {
        createLookup(input: $input) {
          lookup {
            ...lookupFields
          }
        }
      }
      ${LOOKUP_FRAGMENT}
    `,
    { refetchQueries: [{ query: QUERY_LOOKUP }] }
  )

export const useDeleteLookup = () =>
  useMutation<deleteLookup, deleteLookupVariables>(
    gql`
      mutation deleteLookup($input: DeleteLookupInput!) {
        deleteLookup(input: $input) {
          clientMutationId
          deletedLookupNodeId
        }
      }
    `,
    { refetchQueries: [{ query: QUERY_LOOKUP }] }
  )

interface createOrUpdateLookup {
  nodeId?: string
  realm: string
}

export const useCreateOrUpdateLookup = () => {
  const updateLookup = useUpdateLookup()
  const createLookup = useCreateLookup()

  return (values: createOrUpdateLookup) => {
    if (values.nodeId) {
      return updateLookup({
        variables: {
          input: {
            nodeId: values.nodeId,
            patch: {
              realm: values.realm
            }
          }
        }
      })
    } else {
      return createLookup({
        variables: {
          input: {
            lookup: {
              realm: values.realm,
              codeType: 'string',
              internationalize: false,
              valueType: 'string',
              ordering: 'sequencer'
            }
          }
        }
      })
    }
  }
}

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
  const updateLookupValue = useUpdateLookupValue()
  const createLookupValue = useCreateLookupValue()

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
