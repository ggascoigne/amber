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
          	concat(g.slot_id, lpad(cast(row_number() over(partition by g.slot_id order by g.name) as VARCHAR),2,'0')) as "GameNumber",
          	g.slot_id as "Slot",
          	g.name as "Game Title",
          	g.id as "Game Id",
          	u.full_name as "Author",
          	g.gm_names as "GM Names",
          	r.description as "Room"
          from game g 
          join "user" u on g.author_id = u.id
          left join room r on g.room_id = r.id
          where g.year = ${year} and g.slot_id > 0
          order by "Slot", "Game Title"`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
