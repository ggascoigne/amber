import { List, ListItem } from '@material-ui/core'
import { Page } from 'components/Acnw/Page'
import React from 'react'

import { AuthenticatedLink } from '../components/Acnw/AuthenticatedLink'

export const Reports = () => (
  <Page>
    <List>
      <ListItem>
        <AuthenticatedLink url='/api/reports/membershipReport' filename='membership.xlsx'>
          Download Membership Report
        </AuthenticatedLink>
      </ListItem>
      <ListItem>
        <AuthenticatedLink url='/api/reports/gameReport' filename='games.xlsx'>
          Download Game Report
        </AuthenticatedLink>
      </ListItem>
    </List>
  </Page>
)
