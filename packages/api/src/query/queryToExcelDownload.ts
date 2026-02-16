import { getPool, PoolType } from '@amber/server/shared/config'
import type { NextApiResponse } from 'next'
import * as XLSX from 'xlsx/dist/xlsx.mini.min'

export type RefColumn = {
  name: string
  lookupKey: string
  dictionary: Map<unknown, unknown>
  insertAfter: string
  format?: string
}

export type ExcelDownloadOptions = {
  refs?: Array<RefColumn>
}

export const queryToExcelDownload = async (query: string, res: NextApiResponse, options?: ExcelDownloadOptions) => {
  const client = await getPool(PoolType.USER).connect()
  const result = await client.query(query)
  client.release()

  let { rows } = result
  let header: Array<string> | undefined
  const hasRefs = (options?.refs?.length ?? 0) > 0 && rows.length > 0

  if (hasRefs) {
    header = Object.keys(rows[0])

    for (const ref of options!.refs!) {
      const insertIndex = header.indexOf(ref.insertAfter)
      if (insertIndex >= 0) {
        header.splice(insertIndex + 1, 0, ref.name)
      } else {
        header.push(ref.name)
      }
    }

    rows = rows.map((row) => {
      const enriched = { ...row }
      for (const ref of options!.refs!) {
        enriched[ref.name] = ref.dictionary.get(row[ref.lookupKey]) ?? null
      }
      return enriched
    })
  }

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header,
    ...(hasRefs ? { cellDates: true } : {}),
  })

  if (hasRefs) {
    for (const ref of options!.refs!) {
      if (ref.format) {
        const colIndex = header!.indexOf(ref.name)
        if (colIndex >= 0) {
          const colLetter = XLSX.utils.encode_col(colIndex)
          for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
            const cellAddr = `${colLetter}${rowIndex + 1}`
            if (worksheet[cellAddr]) {
              worksheet[cellAddr].z = ref.format
            }
          }
        }
      }
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  const data = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'buffer',
    ...(hasRefs ? { cellDates: true } : {}),
  })

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  res.end(data)
}
