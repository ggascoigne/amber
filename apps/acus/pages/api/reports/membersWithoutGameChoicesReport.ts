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
        u.id as "UserId",
        m.id as "MembershipId",
        m.year as "Year",
        u.full_name as "FullName",
        u.email as "Email"
      from 
        "membership" m
        join "user" u on m.user_id = u.id
        left join "game_submission" gs on m.id = gs.member_id
      where m.year = ${year} and gs.id is null
      order by u.full_name;`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
