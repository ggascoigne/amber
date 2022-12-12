import { NextApiResponse } from 'next'
// @ts-ignore
import json2xls from 'json2xls'

import { getPool, PoolType } from 'database/shared/config'

export const queryToExcelDownload = async (query: string, res: NextApiResponse) => {
  const pool = await getPool(PoolType.USER)
  const client = await pool.connect()
  const result = await client.query(query)
  client.release()

  const data = json2xls(result.rows)

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx')
  res.setHeader('Content-Type', 'application/octet-stream')

  res.end(data, 'binary')
}
