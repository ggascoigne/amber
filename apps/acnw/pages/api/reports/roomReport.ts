import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/roomReport
// auth token: required
// body: {
//  year?: number
// }

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year ?? configuration?.year
    const query = `
      SELECT DISTINCT
        h.id,
        h.description,
        h.quantity,
        COALESCE(hr.allocated, 0) AS allocated,
        h.gaming_room,
        h.bathroom_type,
        h.type
      FROM
        hotel_room h
        JOIN membership m ON m.hotel_room_id = h.id
        LEFT JOIN (
          SELECT
            m.hotel_room_id AS id,
            COUNT(m.hotel_room_id) AS allocated
          FROM
            membership m
          WHERE
            YEAR = ${year}
          GROUP BY
            m.hotel_room_id
        ) hr ON h.id = hr.id
      ORDER BY
        h.id
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
