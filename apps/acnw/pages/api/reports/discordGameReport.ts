import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

// /api/send/gameReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year || configuration?.year
    const query = `
      SELECT
        CONCAT(
          g.slot_id,
          LPAD(
            CAST(
              ROW_NUMBER() OVER (
                PARTITION BY
                  g.slot_id
                ORDER BY
                  g.name
              ) AS VARCHAR
            ),
            2,
            '0'
          )
        ) AS "GameNumber",
        g.slot_id AS "Slot",
        g.name AS "Game Title",
        g.id AS "Game Id",
        u.full_name AS "Author",
        g.gm_names AS "GM Names",
        r.description AS "Room"
      FROM
        game g
        JOIN "user" u ON g.author_id = u.id
        LEFT JOIN room r ON g.room_id = r.id
      WHERE
        g.year = ${year}
        AND g.slot_id > 0
      ORDER BY
        "Slot",
        "Game Title"
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
