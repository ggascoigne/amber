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
        select distinct m.id as "Member Id",
          u.full_name  as "Full Name",
          u.first_name as "First Name",
          u.last_name  as "Last Name",
          u.email      as "email"
          from membership m
            join "user" u on m.user_id = u.id
            join game_assignment ga on ga.member_id = m.id
          where m.year = ${year}
            and ga.gm < 0
          order by "Full Name"`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
