import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

// /api/send/membershipReport
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
        u.id AS "UserId",
        m.id AS "MembershipId",
        m.year AS "Year",
        u.full_name AS "FullName",
        u.email AS "Email"
      FROM
        "membership" m
        JOIN "user" u ON m.user_id = u.id
        LEFT JOIN "game_submission" gs ON m.id = gs.member_id
      WHERE
        m.year = ${year}
        AND gs.id IS NULL
      ORDER BY
        u.full_name
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
