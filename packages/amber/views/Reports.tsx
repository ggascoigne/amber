import { List, ListItem } from '@mui/material'
import { Page } from 'ui'
import React, { useMemo } from 'react'
import { AuthenticatedDownloadButton } from '../components'
import { useConfiguration } from '../utils'
import { HasPermission, Perms, useAuth } from '../components/Auth'

export type ReportRecord = {
  name: string
  url?: string
  fileLabel?: string
  virtual?: boolean
  perm?: Perms
}

const toCamelCase = (words: string) => {
  const parts = words.split(' ')
  return parts.reduce((p, c) => p + c.charAt(0).toUpperCase() + c.slice(1), parts.shift()!.toLowerCase())
}

type ReportsProps = {
  reports: ReportRecord[]
}

export const Reports: React.FC<ReportsProps> = ({ reports }) => {
  const configuration = useConfiguration()
  // name is used in title case in the button as "Download Label Report"
  // if fileLabel is not set, it uses camelCased name
  // if url is not set, it uses fileLabel as api/reports/fileLabelReport
  // if virtual is not set it is always generated, if set, only if matching configuration.virtual
  const abbr = configuration.abbr.toUpperCase()
  const timestamp = new Date().toISOString().replaceAll(/[-.]/g, '_')

  const { hasPermissions } = useAuth()
  const filteredReports = useMemo(
    () =>
      reports.filter(
        (r) =>
          (r.virtual !== undefined ? r.virtual === configuration.virtual : true) &&
          (r.perm !== undefined ? hasPermissions(r.perm) : true)
      ),
    [configuration.virtual, hasPermissions, reports]
  )

  return (
    <Page title='Reports'>
      <List>
        {filteredReports.map((r) => {
          const fileLabel = r?.fileLabel ?? toCamelCase(r.name)
          const url = r?.url ?? `${fileLabel}Report`
          return (
            <ListItem key={url}>
              <AuthenticatedDownloadButton
                url={`/api/reports/${url}`}
                filename={`${abbr}${configuration.year}-${fileLabel}-${timestamp}.xlsx`}
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
