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
    const query = `
      select 
        u.id as "userId", 
        g.id as "gameId", 
        m.id as "memberId", 
        u.full_name as "Full Name", 
        u.email as "Email",
        gc.year as "Year", 
        s.slot as "Slot", 
        gc.rank as "Choice", 
        g.name as "Game Title",
        g.gm_names as "GM Names",
        (case when gc.returning_player then 'Yes' else 'No' end) as "Returning Player",
        gs.message as "Message"
      from game_choice gc 
        join game g on gc.game_id = g.id 
        join slot s on gc.slot_id = s.id 
        join membership m on gc.member_id = m.id 
        join game_submission gs on m.id = gs.member_id and m.year = gs.year 
        join "user" u on m.user_id = u.id 
      where gc.year = ${year} and gc.game_id in (select g.id from "game" g where g.year = ${year} or (g.id >= 596 and g.id <= 604))
      order by u.id, gc.year, s.slot, gc.rank;`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
