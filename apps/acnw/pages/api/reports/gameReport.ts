import { getConfig, queryToExcelDownload, handleError } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/gameReport
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
        g.id AS "Game Id",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        u.email AS "email",
        g.name AS "Game Title",
        g.description AS "Description",
        g.genre AS "Genre",
        g.type AS "Type",
        g.teen_friendly AS "Teen Friendly",
        g.setting AS "Setting",
        g.char_instructions AS "Character Instructions",
        g.player_max AS "Player Max",
        g.player_min AS "Player Min",
        g.player_preference AS "Player Preference",
        g.returning_players AS "Returning Players",
        g.players_contact_gm AS "Contact GM",
        g.game_contact_email AS "Game Contact Email",
        g.slot_id AS "Slot",
        g.slot_preference AS "Slot Preference",
        g.slot_conflicts AS "Slot Conflicts",
        g.estimated_length AS "Estimated Length",
        g.gm_names AS "GM Names",
        g.late_start AS "Late Start",
        g.late_finish AS "Late Finish",
        g.message AS "Message"
      FROM
        game g
        JOIN "user" u ON g.author_id = u.id
      WHERE
        g.year = ${year}
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
