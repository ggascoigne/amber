import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

import { queryToExcelDownload } from './_queryToExcelDownload'

import { getConfig } from '../_constants'
import { handleError } from '../_handleError'

// /api/send/gameReport
// auth token: required
// body: {
//  year?: number
// }

export default withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    const year = req.body?.year || configuration?.year
    const query = `
      SELECT
        g.id AS "NID",
        g.year AS "Con",
        g.slot_id AS "Slot",
        REPLACE(
          REPLACE(
            REPLACE(g.player_preference, 'ret-only', 'Returning Players Only'),
            'ret-pref',
            'Open Spaces'
          ),
          'any',
          'Open Spaces'
        ) AS "Space",
        g.name AS "Title",
        g.gm_names AS "GM(s)",
        REGEXP_REPLACE(g.gm_names, '\n', ' & ') AS "GM(s)",
        REGEXP_REPLACE(g.gm_names, '\n', ',') AS "GMUserNames",
        g.description AS "Description",
        (
          CASE
            WHEN g.teen_friendly THEN 'Yes'
            ELSE 'No'
          END
        ) AS "Teen",
        REPLACE(
          REPLACE(
            REPLACE(g.player_preference, 'ret-only', 'Returning Players Only'),
            'ret-pref',
            'Returning Players Given Preference, New Players Welcome'
          ),
          'any',
          'Any (Returning Players not given preference)'
        ) AS "Accepted",
        g.player_min AS "Min",
        g.player_max AS "Max",
        g.returning_players AS "Returning Players"
      FROM
        game g
        LEFT JOIN "user" u ON g.author_id = u.id
      WHERE
        (
          g.year = ${year}
          AND g.slot_id >= 1
          AND g.slot_id <= 8
        )
        OR (g.author_id IS NULL)
      ORDER BY
        g.slot_id,
        g.year DESC,
        g.name
      `

    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
