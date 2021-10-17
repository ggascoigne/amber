import { List, ListItem } from '@material-ui/core'
import { AuthenticatedDownloadButton } from 'components/AuthenticatedDownloadButton'
import { Page } from 'components/Page'
import React from 'react'

import { configuration } from '../utils'

const Reports = () => (
  <Page title='Reports'>
    <List>
      <ListItem>
        <AuthenticatedDownloadButton
          url='/api/reports/membershipReport'
          filename={`membership-${configuration.year}.xlsx`}
        >
          Download Membership Report
        </AuthenticatedDownloadButton>
      </ListItem>
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/gameReport' filename={`games-${configuration.year}.xlsx`}>
          Download Game Report
        </AuthenticatedDownloadButton>
      </ListItem>
      <ListItem>
        <AuthenticatedDownloadButton
          url='/api/reports/gameReportForDiscord'
          filename={`gamesDiscord-${configuration.year}.xlsx`}
        >
          Download Discord Game Report
        </AuthenticatedDownloadButton>
      </ListItem>
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/gmReport' filename={`gm-${configuration.year}.xlsx`}>
          Download GM Report
        </AuthenticatedDownloadButton>
      </ListItem>
      <ListItem>
        <AuthenticatedDownloadButton
          url='/api/reports/gamesAndPlayers'
          filename={`gamesAndPlayers-${configuration.year}.xlsx`}
        >
          Download Game and Players Report
        </AuthenticatedDownloadButton>
      </ListItem>
    </List>
  </Page>
)

export default Reports
