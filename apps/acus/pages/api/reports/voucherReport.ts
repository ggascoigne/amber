import { getConfig, handleError, queryToExcelDownload } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    if (!configuration) throw new Error('Unable to load configuration')
    const year = req.body?.year ?? configuration.year

    const query = `
      SELECT
        u.full_name AS "Member",
        CAST(m.attendance AS INTEGER) AS "Days Attending",
        COALESCE(gm_counts.gm_slots, 0)::integer AS "GM Slots",
        CASE
          WHEN CAST(m.attendance AS INTEGER) = 3 THEN 15
          WHEN CAST(m.attendance AS INTEGER) = 4 THEN 20
          ELSE 0
        END AS "Attendance Vouchers ($)",
        (COALESCE(gm_counts.gm_slots, 0) * 5)::integer AS "GM Vouchers ($)",
        (CASE
          WHEN CAST(m.attendance AS INTEGER) = 3 THEN 15
          WHEN CAST(m.attendance AS INTEGER) = 4 THEN 20
          ELSE 0
        END + COALESCE(gm_counts.gm_slots, 0) * 5)::integer AS "Total Vouchers ($)"
      FROM
        membership m
        JOIN "user" u ON m.user_id = u.id
        LEFT JOIN (
          SELECT ga.member_id, COUNT(*) AS gm_slots
          FROM game_assignment ga
          WHERE ga.gm > 0 AND ga.year = ${year}
          GROUP BY ga.member_id
        ) gm_counts ON gm_counts.member_id = m.id
      WHERE
        m.year = ${year}
        AND m.attending = true
      ORDER BY
        u.full_name
      `
    await queryToExcelDownload(query, res)
  } catch (err: any) {
    handleError(err, res)
  }
})
