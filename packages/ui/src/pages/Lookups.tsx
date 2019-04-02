import { Page } from 'components/Acnw/Page'
import React from 'react'

import { LookupsQuery } from '../components/Acnw/LookupsQuery'

export const Lookups = () => {
  return (
    <Page>
      <LookupsQuery>
        {({ lookups }) => {
          return JSON.stringify(lookups, null, 2)
        }}
      </LookupsQuery>
    </Page>
  )
}
