import { List, ListItem } from '@material-ui/core'
import { Page } from 'components/Acnw/Page'
import React from 'react'

import { AuthenticatedDownloadButton } from '../components/Acnw/AuthenticatedDownloadButton'

const Reports = () => (
  <Page>
    <List>
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/membershipReport' filename='membership.xlsx'>
          Download Membership Report
        </AuthenticatedDownloadButton>
      </ListItem>
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/gameReport' filename='games.xlsx'>
          Download Game Report
        </AuthenticatedDownloadButton>
      </ListItem>
    </List>
  </Page>
)

export default Reports
