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
        g.id as "NID",
        g.year as "Con",
        g.slot_id as "Slot",
        REPLACE(REPLACE(REPLACE(g.player_preference,'ret-only','Returning Players Only'),'ret-pref','Open Spaces'),'any','Open Spaces') as "Space",
        g.name as "Title",
        g.gm_names as "GM(s)",
        REGEXP_REPLACE(g.gm_names, '\n', ' & ') as "GM(s)",
        REGEXP_REPLACE(g.gm_names, '\n', ',') as "GMUserNames",
        g.description as "Description",
        (case when g.teen_friendly then 'Yes' else 'No' end) as "Teen",
        REPLACE(REPLACE(REPLACE(g.player_preference,'ret-only','Returning Players Only'),'ret-pref','Returning Players Given Preference, New Players Welcome'),'any','Any (Returning Players not given preference)') as "Accepted",
        g.player_min as "Min",
        g.player_max as "Max",
        g.returning_players as "Returning Players"
      from game g
      left join "user" u on g.author_id = u.id
      where (g.year = ${year} and g.slot_id >=1 and g.slot_id <=8) or (g.author_id is null)
      order by g.slot_id, g.year desc, g.name;`

    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
