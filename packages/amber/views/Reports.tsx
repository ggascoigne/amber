import { List, ListItem } from '@mui/material'
import { Page } from 'ui'
import { AuthenticatedDownloadButton } from '../components/AuthenticatedDownloadButton'
import { useConfiguration } from '../utils'

const Reports = () => {
  const configuration = useConfiguration()
  // name is used in title case in the button as "Download Label Report"
  // if url is not set, it uses lowercased name as api/reports/nameReport
  // if filelabel is not set, it uses name
  // if apps is not set it is always generated, otherwise only for matching configuration.abbr
  // if virtual is not set it is always generated, if set, only if matching configuration.virtual
  type ReportRecord = { name: string; url?: string; filelabel?: string; apps?: string[]; virtual?: boolean }
  const reports: ReportRecord[] = [
    { name: 'Membership' },
    { name: 'Game' },
    { name: 'Discord Game', url: 'gameReportForDiscord', filelabel: 'gamesDiscord', virtual: true },
    { name: 'GM' },
    { name: 'Game And Players', url: 'gamesAndPlayers', filelabel: 'gamesAndPlayers' },
    { name: 'Room Usage', url: 'roomReport', filelabel: 'room', apps: ['acnw'] },
    { name: 'Gamescheduler', apps: ['acus'] },
  ]
  const timestamp = new Date().toISOString().replaceAll('-', '_').replaceAll('.', '_')

  return (
    <Page title='Reports'>
      <List>
        {reports.map((r) => {
          if (r.apps !== undefined && !r.apps.includes(configuration.abbr)) {
            return <></>
          }
          if (r.virtual !== undefined && r.virtual !== configuration.virtual) {
            return <></>
          }
          const filelabel = r.filelabel !== undefined ? r.filelabel : r.name.toLowerCase()
          const url = r.url !== undefined ? r.url : `${r.name.toLowerCase()}Report`
          console.log(r.name)
          console.log(url)
          return (
            <ListItem>
              <AuthenticatedDownloadButton
                url={`/api/reports/${url}`}
                filename={`${configuration.abbr.toUpperCase()}${configuration.year}-${filelabel}-${timestamp}.xlsx`}
              >
                Download {r.name} Report
              </AuthenticatedDownloadButton>
            </ListItem>
          )
        })}
      </List>
    </Page>
  )
}

export default Reports
