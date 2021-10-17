import { Request, Response } from 'express'

import { requireJwt } from '../_checkJwt'
import { configuration } from '../_constants'
import { handleError } from '../_handleError'
import { withApiHandler } from '../_standardHandler'
import { queryToExcelDownload } from './_queryToExcelDownload'

// /api/send/membershipReport
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
          where m.year = ${year} and g.name != 'No Game' and ga.gm >= 0
          order by "Slot", "Game", ga.gm desc, "Member"
        `
      await queryToExcelDownload(query, res)
    } catch (err: any) {
      handleError(err, res)
    }
  },
])
