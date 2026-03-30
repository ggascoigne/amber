import { useCallback, useMemo, useState } from 'react'

import { useTRPC } from '@amber/client'
import type { ReportId } from '@amber/server/src/api/contracts/reports'
import { useNotification } from '@amber/ui'
import { Button, List, ListItem } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { downloadReportWorkbook } from './Reports/downloadReportWorkbook'

import { Page } from '../components'
import type { Perms } from '../components/Auth'
import { useAuth } from '../components/Auth'
import { useConfiguration } from '../utils'

export type ReportRecord = {
  fileLabel?: string
  name: string
  perm?: Perms
  reportId: ReportId
  virtual?: boolean
}

type ReportsProps = {
  reports: ReportRecord[]
}

const Reports = ({ reports }: ReportsProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const configuration = useConfiguration()
  const notify = useNotification()
  const [activeReportId, setActiveReportId] = useState<ReportId | null>(null)
  const abbr = configuration.abbr.toUpperCase()
  const timestamp = new Date().toISOString().replaceAll(/[-.]/g, '_')

  const { hasPermissions } = useAuth()
  const filteredReports = useMemo(
    () =>
      reports.filter(
        (r) =>
          (r.virtual !== undefined ? r.virtual === configuration.virtual : true) &&
          (r.perm !== undefined ? hasPermissions(r.perm) : true),
      ),
    [configuration.virtual, hasPermissions, reports],
  )

  const handleDownload = useCallback(
    async ({ fileLabel, reportId }: { fileLabel: string; reportId: ReportId }) => {
      setActiveReportId(reportId)

      try {
        const workbookData = await queryClient.fetchQuery(
          trpc.reports.getWorkbookData.queryOptions({
            reportId,
            year: configuration.year,
          }),
        )

        downloadReportWorkbook({
          filename: `${abbr}${configuration.year}-${fileLabel}-${timestamp}.xlsx`,
          workbookData,
        })
      } catch (error: any) {
        notify({
          text: error?.message ?? 'Unable to download report',
          variant: 'error',
        })
      } finally {
        setActiveReportId(null)
      }
    },
    [abbr, configuration.year, notify, queryClient, timestamp, trpc.reports.getWorkbookData],
  )

  return (
    <Page title='Reports'>
      <List>
        {filteredReports.map((r) => {
          const fileLabel = r.fileLabel ?? r.reportId.replace(/Report$/, '')
          return (
            <ListItem key={r.reportId}>
              <Button
                color='primary'
                disabled={activeReportId === r.reportId}
                onClick={() => handleDownload({ fileLabel, reportId: r.reportId })}
                variant='outlined'
              >
                Download {r.name} Report
              </Button>
            </ListItem>
          )
        })}
      </List>
    </Page>
  )
}

export { Reports }
