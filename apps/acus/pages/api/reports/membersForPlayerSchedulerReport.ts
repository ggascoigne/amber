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
        u.display_name AS "Common Name",
        u.display_name AS "Display Name",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        REPLACE(u.display_name, u.display_name, '') AS "Phone Number",
        m.id AS "Member ID",
        u.email AS "E-mail",
        mc.times_attending AS "Times Attending",
        COALESCE(gm.isGm, FALSE) AS "Is GM",
        m.message AS "MMessage",
        gs.message AS "GSMessage",
        u.id AS "Uid"
      FROM
        membership m
        JOIN "user" u ON m.user_id = u.id
        LEFT JOIN "game_submission" gs ON m.id = gs.member_id
        LEFT JOIN (
          SELECT DISTINCT
            m.id,
            TRUE AS isGm
          FROM
            membership m
            JOIN game_assignment ga ON ga.member_id = m.id
          WHERE
            m.year = ${year}
            AND ga.gm < 0
        ) gm ON gm.id = m.id
        JOIN hotel_room h ON m.hotel_room_id = h.id
        LEFT JOIN (
          SELECT
            m.user_id,
            COUNT(m.user_id) AS times_attending
          FROM
            membership m
          GROUP BY
            m.user_id
        ) mc ON u.id = mc.user_id
      WHERE
        m.year = ${year}
      ORDER BY
        u.full_name
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
