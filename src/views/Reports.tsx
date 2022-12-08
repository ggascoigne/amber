import { List, ListItem } from '@mui/material'
import { AuthenticatedDownloadButton } from '@/components/AuthenticatedDownloadButton'
import { Page } from '@/components/Page'

import { configuration } from '@/utils'

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
      {configuration.virtual && (
        <ListItem>
          <AuthenticatedDownloadButton
            url='/api/reports/gameReportForDiscord'
            filename={`gamesDiscord-${configuration.year}.xlsx`}
          >
            Download Discord Game Report
          </AuthenticatedDownloadButton>
        </ListItem>
      )}
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
      <ListItem>
        <AuthenticatedDownloadButton url='/api/reports/roomReport' filename={`roomReport-${configuration.year}.xlsx`}>
          Download Room Usage Report
        </AuthenticatedDownloadButton>
      </ListItem>
    </List>
  </Page>
)

export default Reports
