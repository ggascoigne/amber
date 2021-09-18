import { List, ListItem } from '@material-ui/core'
import { AuthenticatedDownloadButton } from 'components/AuthenticatedDownloadButton'
import { Page } from 'components/Page'
import React from 'react'

const Reports = () => (
  <Page title='Reports'>
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
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/gmReport' filename='gm.xlsx'>
          Download GM Report
        </AuthenticatedDownloadButton>
      </ListItem>
    </List>
  </Page>
)

export default Reports
