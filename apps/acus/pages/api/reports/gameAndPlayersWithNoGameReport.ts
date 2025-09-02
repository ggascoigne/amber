import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import { NextApiRequest, NextApiResponse } from 'next'

// /api/send/membershipReport
// auth token: required
// body: {
//  year?: number
// }

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year ?? configuration?.year
    const query = `
      SELECT
        g.slot_id AS "Slot",
        g.name AS "Game",
        u.full_name AS "Member",
        CASE
          WHEN (ga.gm > 0) THEN 'GM'
          ELSE ''
        END AS "GM"
      FROM
        membership m
        JOIN game_assignment ga ON m.id = ga.member_id
        JOIN game g ON g.id = ga.game_id
        JOIN "user" u ON m.user_id = u.id
      WHERE
        m.year = ${year}
        AND ga.gm >= 0
      ORDER BY
        "Slot",
        "Game",
        ga.gm DESC,
        "Member"
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
