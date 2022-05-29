import { VercelRequest, VercelResponse } from '@vercel/node'

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
  async (req: VercelRequest, res: VercelResponse) => {
    try {
      const year = req.body?.year || configuration.year
      const query = `
        select 
          m.id as "Member Id",
          u.full_name as "Full Name",
          u.first_name as "First Name",
          u.last_name as "Last Name",
          u.email as "email",
          m.slots_attending as "Slots Attending",
          coalesce(gm.isGm,false) as "isGM",
          m.message as "Message"
        from membership m 
          join "user" u on m.user_id = u.id 
          left join (select distinct m.id, true as isGm
                from membership m
                  join game_assignment ga on ga.member_id = m.id
                where m.year = ${year} and ga.gm < 0
          ) gm on gm.id = m.id
        where m.year = ${year}`
      await queryToExcelDownload(query, res)
    } catch (err: any) {
      handleError(err, res)
    }
  },
])
