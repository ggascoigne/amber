import { useCallback, useMemo, useState } from 'react'

import { useTRPC } from '@amber/client'
import type { PdfReportId, ReportId } from '@amber/server/src/api/contracts/reports'
import { useNotification } from '@amber/ui'
import { Button, List, ListItem, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { downloadReportPdf } from './Reports/downloadReportPdf'
import { downloadReportWorkbook } from './Reports/downloadReportWorkbook'

import { Page } from '../components'
import type { Perms } from '../components/Auth'
import { useAuth } from '../components/Auth'
import { useConfiguration } from '../utils/configContext'
import { useYearFilter } from '../utils/useYearFilterState'

export type ReportRecord = {
  fileLabel?: string
  name: string
  perm?: Perms
  reportId: ReportId
  virtual?: boolean
}

export type PdfReportRecord = {
  fileLabel?: string
  name: string
  pdfReportId: PdfReportId
  perm?: Perms
  virtual?: boolean
}

type ReportsProps = {
  pdfReports?: Array<PdfReportRecord>
  reports: ReportRecord[]
}

const Reports = ({ pdfReports = [], reports }: ReportsProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const configuration = useConfiguration()
  const notify = useNotification()
  const [activeReportId, setActiveReportId] = useState<ReportId | null>(null)
  const [activePdfReportId, setActivePdfReportId] = useState<PdfReportId | null>(null)
  const abbr = configuration.abbr.toUpperCase()
  const [year] = useYearFilter()
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
  const filteredPdfReports = useMemo(
    () =>
      pdfReports.filter(
        (r) =>
          (r.virtual !== undefined ? r.virtual === configuration.virtual : true) &&
          (r.perm !== undefined ? hasPermissions(r.perm) : true),
      ),
    [configuration.virtual, hasPermissions, pdfReports],
  )

  const handleDownload = useCallback(
    async ({ fileLabel, reportId }: { fileLabel: string; reportId: ReportId }) => {
      setActiveReportId(reportId)

      try {
        const workbookData = await queryClient.fetchQuery(
          trpc.reports.getWorkbookData.queryOptions({
            reportId,
            year,
          }),
        )

        downloadReportWorkbook({
          filename: `${abbr}${year}-${fileLabel}-${timestamp}.xlsx`,
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
    [abbr, notify, queryClient, timestamp, trpc.reports.getWorkbookData, year],
  )

  const handlePdfDownload = useCallback(
    async ({ fileLabel, pdfReportId }: { fileLabel: string; pdfReportId: PdfReportId }) => {
      setActivePdfReportId(pdfReportId)

      try {
        const pdfData = await queryClient.fetchQuery(
          trpc.reports.getPdfData.queryOptions({
            pdfReportId,
            year,
          }),
        )

        downloadReportPdf({
          filename: `${abbr}${year}-${fileLabel}-${timestamp}.pdf`,
          pdfData,
        })
      } catch (error: any) {
        notify({
          text: error?.message ?? 'Unable to download PDF report',
          variant: 'error',
        })
      } finally {
        setActivePdfReportId(null)
      }
    },
    [abbr, notify, queryClient, timestamp, trpc.reports.getPdfData, year],
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
      {filteredPdfReports.length > 0 ? (
        <>
          <Typography component='h2' sx={{ mt: 2 }} variant='h6'>
            PDF Reports
          </Typography>
          <List>
            {filteredPdfReports.map((r) => {
              const fileLabel = r.fileLabel ?? r.pdfReportId
              return (
                <ListItem key={r.pdfReportId}>
                  <Button
                    color='primary'
                    disabled={activePdfReportId === r.pdfReportId}
                    onClick={() => handlePdfDownload({ fileLabel, pdfReportId: r.pdfReportId })}
                    variant='outlined'
                  >
                    Download {r.name} PDF
                  </Button>
                </ListItem>
              )
            })}
          </List>
        </>
      ) : null}
    </Page>
  )
}

export { Reports }
