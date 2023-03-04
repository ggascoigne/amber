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
        u.display_name as "Common Name",
        u.display_name as "Display Name",
        u.full_name as "Full Name",
        u.first_name as "First Name",
        u.last_name as "Last Name",
        REPLACE(u.display_name, u.display_name, '') as "Phone Number",
        m.id as "Member ID",
        u.email as "E-mail",
        mc.times_attending as "Times Attending",
        coalesce(gm.isGm,false) as "Is GM",
        m.message as "MMessage",
        gs.message as "GSMessage",
        u.id as "Uid"
        from membership m 
        join "user" u on m.user_id = u.id 
        left join "game_submission" gs on m.id = gs.member_id
        left join (select distinct m.id, true as isGm
          from membership m
          join game_assignment ga on ga.member_id = m.id
          where m.year = ${year} and ga.gm < 0
        ) gm on gm.id = m.id
        join hotel_room h on m.hotel_room_id = h.id
        left join (select m.user_id, count(m.user_id) as times_attending 
        from membership m 
        group by m.user_id
        ) mc on u.id = mc.user_id
    where m.year = ${year}
    order by u.full_name;`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
