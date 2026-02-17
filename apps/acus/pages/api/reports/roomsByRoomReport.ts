import { handleError, queryToExcelDownload } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `
      SELECT
        r.description AS "Room",
        g.year AS "Year",
        g.slot_id AS "Slot",
        g.name AS "Game Name",
        g.gm_names AS "GM Names"
      FROM
        game g
        INNER JOIN room r ON g.room_id = r.id
      WHERE
        r.type IN ('Presidential Suite', 'Shared Spaces')
      ORDER BY
        r.description,
        g.slot_id,
        g.year
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
