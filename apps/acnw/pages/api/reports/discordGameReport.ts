import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/gameReport
// auth token: required
// body: {
//  year?: number
// }

const inner = auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year ?? configuration?.year
    // cspell:disable
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
    // cspell:enable
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  inner(req, res)
}
