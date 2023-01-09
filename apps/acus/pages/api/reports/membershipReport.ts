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
    const query = configuration.virtual
      ? `
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
      : `
        select 
          m.id as "Member Id",
          u.full_name as "Full Name",
          u.first_name as "First Name",
          u.last_name as "Last Name",
          u.email as "email",
          coalesce(gm.isGm,false) as "isGM",
          mc.times_attending as "Times Attending",
          m.attending as "isAttending",
          m.attendance as "Attendance",
          m.volunteer as "isVolunteer",
          m.message as "Message"
          from membership m 
          join "user" u on m.user_id = u.id 
          left join (select distinct m.id, true as isGm
              from membership m
                join game_assignment ga on ga.member_id = m.id
              where m.year = 2022 and ga.gm < 0
          ) gm on gm.id = m.id
          join hotel_room h on m.hotel_room_id = h.id
          left join (select m.user_id, count(m.user_id) as times_attending 
            from membership m 
            group by m.user_id
          ) mc on u.id = mc.user_id
        where m.year = ${year};
        `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
