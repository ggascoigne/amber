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
    const query = configuration?.virtual
      ? `
        SELECT
          m.id AS "Member Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          u.amount_owed AS "Amount Owed",
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
        `
      : `
        SELECT
          m.id AS "Member Id",
          u.id AS "User Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          u.amount_owed AS "Amount Owed",
          h.description AS "Room",
          COALESCE(gm.isGm, FALSE) AS "isGM",
          mc.times_attending AS "Times Attending",
          m.arrival_date AS "Arriving",
          m.departure_date AS "Departing",
          m.attending AS "isAttending",
          m.attendance AS "Attendance",
          m.request_old_price AS "Requests Subsidy",
          m.volunteer AS "isVolunteer",
          m.rooming_with AS "Rooming With",
          m.room_preference_and_notes AS "Room Preferences/Notes",
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
              m.year = ${year}2
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
        `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
