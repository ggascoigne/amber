import { Request, Response } from 'express'

import { requireJwt } from '../_checkJwt'
import { configuration } from '../_constants'
import { handleError } from '../_handleError'
import { withApiHandler } from '../_standardHandler'
import { queryToExcelDownload } from './_queryToExcelDownload'

// /api/send/gameReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiHandler([
  requireJwt,
  async (req: Request, res: Response) => {
    try {
      const year = req.body?.year || configuration.year
      const query = `
          select 
            u.full_name as "Full Name",
            u.email as "email",
            g.name as "Name",
            g.description as "Description",
            g.genre as "Genre",
            g.type as "Type",
            g.teen_friendly as "Teen Friendly",
            g.setting as "Setting",
            g.char_instructions as "Character Instructions",
            g.player_max as "Player Max",
            g.player_min as "Player Min",
            g.player_preference as "Player Preference",
            g.returning_players as "Returning Players",
            g.players_contact_gm as "Contact GM",
            g.game_contact_email as "Game Contact Email",
            g.slot_preference as "Slot Preference",
            g.slot_conflicts as "Slot Conflicts",
            g.estimated_length as "Estimated Length",
            g.gm_names as "GM Names",
            g.late_start as "Late Start",
            g.late_finish as "Late Finish",
            g.message as "Message"
            from game g join "user" u  on g.author_id = u.id
          where g.year = ${year}`
      await queryToExcelDownload(query, res)
    } catch (err) {
      handleError(err, res)
    }
  },
])
