import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { configuration } from '../_constants'
import { handleError } from '../_handleError'
import { queryToExcelDownload } from './_queryToExcelDownload'

// /api/send/membershipReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const year = req.body?.year || configuration.year
    const query = configuration.virtual
      ? `
        SELECT
          m.id AS "Member Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          m.slots_attending AS "Slots Attending",
          COALESCE(gm.isGm, FALSE) AS "isGM",
          m.message AS "Message"
        FROM
          membership m
          JOIN "user" u ON m.user_id = u.id
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
        WHERE
          m.year = ${year}
        ORDER BY
          u.full_name
        `
      : `
        SELECT
          m.id AS "Member Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          COALESCE(gm.isGm, FALSE) AS "isGM",
          gmc.times_gming AS "timesGMing",
          mc.times_attending AS "Times Attending",
          m.attending AS "isAttending",
          m.attendance AS "daysAttending",
          m.attendance AS "Attendance",
          m.volunteer AS "isVolunteer",
          m.message AS "Message"
        FROM
          membership m
          JOIN "user" u ON m.user_id = u.id
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
          LEFT JOIN (
            SELECT
              ga.member_id,
              ga.year,
              COUNT(ga.member_id) AS times_gming
            FROM
              game_assignment ga
              JOIN game g ON ga.game_id = g.id
            WHERE
              ga.gm < 0
              AND g.slot_id >= 1
              AND g.slot_id <= 8
            GROUP BY
              ga.member_id,
              ga.year
          ) gmc ON m.id = gmc.member_id
          AND m.year = gmc.year
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
