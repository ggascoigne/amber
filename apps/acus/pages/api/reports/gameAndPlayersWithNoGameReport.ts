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
          	g.slot_id as "Slot",
          	g.name as "Game",
          	u.full_name as "Member",
          	CASE
          	  WHEN (ga.gm >0) THEN 'GM'
          	  ELSE ''
          	END AS "GM"
          from membership m 
          join game_assignment ga on m.id = ga.member_id
          join game g on g.id = ga.game_id
          join "user" u on m.user_id = u.id
          where m.year = ${year} and ga.gm >= 0
          order by "Slot", "Game", ga.gm desc, "Member"
        `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
