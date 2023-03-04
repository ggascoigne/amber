import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { configuration } from '../_constants'
import { handleError } from '../_handleError'
import { queryToExcelDownload } from './_queryToExcelDownload'

// /api/send/gameReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const year = req.body?.year || configuration.year
    const query = `
          select 
            g.id as "Game ID",
            u.full_name as "Submitted By",
            u.email as "Email",
            g.name as "Game Title",
            g.gm_names as "GM Names",
            g.description as "Description",
            g.teen_friendly as "Teen Friendly",
            g.player_min as "Player Min",
            g.player_max as "Player Max",
            g.player_preference as "Player Preference",
            g.slot_id as "Slot",
            g.slot_preference as "Slot Preference",
            g.message as "Message"
            from game g 
            join "user" u  on g.author_id = u.id
          where g.year = ${year}
          order by g.year, g.slot_id, g.name`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
