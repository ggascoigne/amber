import { List, ListItem } from '@mui/material'
import { Page } from 'ui'
import { AuthenticatedDownloadButton } from '../components/AuthenticatedDownloadButton'
import { useConfiguration } from '../utils'

const Reports = () => {
  const configuration = useConfiguration()
  const timestamp = new Date().toISOString().replaceAll('-', '_').replaceAll('.', '_')
  return (
    <Page title='Reports'>
      <List>
        <ListItem>
          <AuthenticatedDownloadButton
            url='/api/reports/membershipReport'
            filename={`${configuration.abbr.toUpperCase()}${configuration.year}-membership-${timestamp}.xlsx`}
          >
            Download Membership Report
          </AuthenticatedDownloadButton>
        </ListItem>
        <ListItem>
          <AuthenticatedDownloadButton
            url='/api/reports/gameReport'
            filename={`${configuration.abbr.toUpperCase()}${configuration.year}-games-${timestamp}.xlsx`}
          >
            Download Game Report
          </AuthenticatedDownloadButton>
        </ListItem>
        {configuration.virtual && (
          <ListItem>
            <AuthenticatedDownloadButton
              url='/api/reports/gameReportForDiscord'
              filename={`${configuration.abbr.toUpperCase()}${configuration.year}-gamesDiscord-${timestamp}.xlsx`}
            >
              Download Discord Game Report
            </AuthenticatedDownloadButton>
          </ListItem>
        )}
        <ListItem>
          <AuthenticatedDownloadButton
            url='/api/reports/gmReport'
            filename={`${configuration.abbr.toUpperCase()}${configuration.year}-gm-${timestamp}.xlsx`}
          >
            Download GM Report
          </AuthenticatedDownloadButton>
        </ListItem>
        <ListItem>
          <AuthenticatedDownloadButton
            url='/api/reports/gamesAndPlayers'
            filename={`${configuration.abbr.toUpperCase()}${configuration.year}-gamesAndPlayers-${timestamp}.xlsx`}
          >
            Download Game and Players Report
          </AuthenticatedDownloadButton>
        </ListItem>
        {configuration.abbr === 'acnw' && (
          <ListItem>
            <AuthenticatedDownloadButton
              url='/api/reports/roomReport'
              filename={`${configuration.abbr.toUpperCase()}${configuration.year}-roomReport-${timestamp}.xlsx`}
            >
              Download Room Usage Report
            </AuthenticatedDownloadButton>
          </ListItem>
        )}
        {configuration.abbr === 'acus' && (
          <ListItem>
            <AuthenticatedDownloadButton
              url='/api/reports/gameschedulerReport'
              filename={`${configuration.abbr.toUpperCase()}${
                configuration.year
              }-gameschedulerReport-${timestamp}.xlsx`}
            >
              Download Game Scheduler Report
            </AuthenticatedDownloadButton>
          </ListItem>
        )}
      </List>
    </Page>
  )
}

export default Reports
