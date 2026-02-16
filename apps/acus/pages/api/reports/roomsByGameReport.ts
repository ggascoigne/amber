import { handleError, queryToExcelDownload } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `
      SELECT
        g.name AS "Game Name",
        g.gm_names AS "GM Names",
        g.year AS "Year",
        g.slot_id AS "Slot",
        r.description AS "Room"
      FROM
        game g
        INNER JOIN room r ON g.room_id = r.id
      WHERE
        r.type IN ('Presidential Suite', 'Shared Spaces')
      ORDER BY
        g.name,
        g.year,
        g.slot_id
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
