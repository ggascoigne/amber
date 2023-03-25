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
      SELECT
        u.id AS "userId",
        g.id AS "gameId",
        m.id AS "memberId",
        u.full_name AS "Full Name",
        u.email AS "Email",
        gc.year AS "Year",
        gc.slot_id AS "Slot",
        gc.rank AS "Choice",
        g.name AS "Game Title",
        g.gm_names AS "GM Names",
        (
          CASE
            WHEN gc.returning_player THEN 'Yes'
            ELSE 'No'
          END
        ) AS "Returning Player",
        gs.message AS "Message"
      FROM
        game_choice gc
        JOIN game g ON gc.game_id = g.id
        JOIN membership m ON gc.member_id = m.id
        JOIN game_submission gs ON m.id = gs.member_id
        AND m.year = gs.year
        JOIN "user" u ON m.user_id = u.id
      WHERE
        gc.year = ${year}
        AND gc.game_id IN (
          SELECT
            g.id
          FROM
            "game" g
          WHERE
            g.year = ${year}
            OR (g.author_id IS NULL)
        )
      ORDER BY
        u.full_name,
        gc.year,
        gc.slot_id,
        gc.rank
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
