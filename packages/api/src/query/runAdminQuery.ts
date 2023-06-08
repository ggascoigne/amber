import { getPool, PoolType } from 'database/shared/config'

export const runAdminQuery = async (query: string, values?: any[]) => {
  const pool = getPool(PoolType.ADMIN)
  let result
  let client
  try {
    client = await pool.connect()
    result = await client.query(query, values)
    client.release()
  } catch (error) {
    client?.release()
    console.log(error)
    throw error
  }
  return result
}
