import { getPool, PoolType } from 'database/shared/config'
import json2xls from 'json2xls'
import { NextApiResponse } from 'next'

export const queryToExcelDownload = async (query: string, res: NextApiResponse) => {
  const client = await getPool(PoolType.USER).connect()
  const result = await client.query(query)
  client.release()

  const data = json2xls(result.rows)

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Content-Disposition', 'attachment; filename=file.xlsx')
  res.setHeader('Content-Type', 'application/octet-stream')

  res.end(data, 'binary')
}
