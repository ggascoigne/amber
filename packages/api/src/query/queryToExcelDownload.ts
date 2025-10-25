import { getPool, PoolType } from '@amber/database/shared/config'
import type { NextApiResponse } from 'next'
import * as XLSX from 'xlsx/dist/xlsx.mini.min'

export const queryToExcelDownload = async (query: string, res: NextApiResponse) => {
  const client = await getPool(PoolType.USER).connect()
  const result = await client.query(query)
  client.release()

  const worksheet = XLSX.utils.json_to_sheet(result.rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  const data = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  res.end(data)
}
