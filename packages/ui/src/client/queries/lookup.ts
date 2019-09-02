import { createLookup, createLookupVariables } from '__generated__/createLookup'
import { deleteLookup, deleteLookupVariables } from '__generated__/deleteLookup'
import { GetLookups } from '__generated__/GetLookups'
import { updateLookupByNodeId, updateLookupByNodeIdVariables } from '__generated__/updateLookupByNodeId'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { LOOKUP_FRAGMENT, LOOKUP_VALUES_FRAGMENT } from 'client'
import gql from 'graphql-tag'

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

export const useLookupsQuery = () => useQuery<GetLookups>(QUERY_LOOKUP)

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
  const [updateLookup] = useUpdateLookup()
  const [createLookup] = useCreateLookup()

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
