import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { configuration } from '../_constants'
import { handleError } from '../_handleError'
import { queryToExcelDownload } from './_queryToExcelDownload'

// /api/send/roomReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const year = req.body?.year || configuration.year
    const query = `
          select distinct 
              h.id, 
              h.description, 
              h.quantity, 
              coalesce(hr.allocated,0) as allocated, 
              h.gaming_room, 
              h.bathroom_type, 
              h.type 
          from hotel_room h
          join membership m on m.hotel_room_id = h.id
          left join (
            select 
                m.hotel_room_id as id, 
                count(m.hotel_room_id) as allocated 
            from membership m where year = ${year} group by m.hotel_room_id) hr 
              on h.id = hr.id
          order by h.id`
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
