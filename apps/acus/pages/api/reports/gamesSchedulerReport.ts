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
    const query = `
      SELECT
        g.id AS "Game ID",
        u.full_name AS "Submitted By",
        u.email AS "Email",
        g.name AS "Game Title",
        g.gm_names AS "GM Names",
        g.description AS "Description",
        g.teen_friendly AS "Teen Friendly",
        g.player_min AS "Player Min",
        g.player_max AS "Player Max",
        g.player_preference AS "Player Preference",
        g.slot_id AS "Slot",
        g.slot_preference AS "Slot Preference",
        g.message AS "Message"
      FROM
        game g
        JOIN "user" u ON g.author_id = u.id
      WHERE
        g.year = ${year}
      ORDER BY
        g.year,
        g.slot_id,
        g.name
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  inner(req, res)
}
