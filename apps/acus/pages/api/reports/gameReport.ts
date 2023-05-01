import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

import { queryToExcelDownload } from './_queryToExcelDownload'

import { getConfig } from '../_constants'
import { handleError } from '../_handleError'

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
        g.id AS "Game Id",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        u.email AS "email",
        g.name AS "Game Title",
        g.description AS "Description",
        g.teen_friendly AS "Teen Friendly",
        g.player_max AS "Player Max",
        g.player_min AS "Player Min",
        g.player_preference AS "Player Preference",
        g.returning_players AS "Returning Players",
        g.players_contact_gm AS "Contact GM",
        g.game_contact_email AS "Game Contact Email",
        g.slot_id AS "Slot",
        g.slot_preference AS "Slot Preference",
        g.gm_names AS "GM Names",
        g.late_start AS "Late Start",
        g.late_finish AS "Late Finish",
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
