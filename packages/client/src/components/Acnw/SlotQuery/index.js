import { SLOT_FRAGMENT } from 'client/fragments'
import { GqlQuery } from 'components/Acnw/GqlQuery'
import gql from 'graphql-tag'
import get from 'lodash/get'
import * as PropTypes from 'prop-types'
import React from 'react'

const QUERY_SLOTS = gql`
  {
    slots {
      nodes {
        ...slotFields
      }
    }
  }
  ${SLOT_FRAGMENT}
`
export const SlotQuery = ({ year, children }) => {
  return (
    <GqlQuery query={QUERY_SLOTS} errorPolicy='all'>
      {data => children && children({ year, slots: get(data, 'slots.nodes') })}
    </GqlQuery>
  )
}

SlotQuery.propTypes = {
  year: PropTypes.number.isRequired,
  children: PropTypes.func.isRequired
}
