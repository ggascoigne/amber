import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/membershipReport
// auth token: required
// body: {
//  year?: number
// }

const inner = auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year ?? configuration?.year
    const query = `
      SELECT DISTINCT
        m.id AS "Member Id",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        u.email AS "email"
      FROM
        membership m
        JOIN "user" u ON m.user_id = u.id
        JOIN game_assignment ga ON ga.member_id = m.id
      WHERE
        m.year = ${year}
        AND ga.gm < 0
      ORDER BY
        "Full Name"
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  inner(req, res)
}
