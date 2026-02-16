import { getSlotTimes } from '@amber/amber/utils/slotTimes'
import { getConfig, handleError, queryToExcelDownload } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const configuration = await getConfig()
    if (!configuration) throw new Error('Unable to load configuration')
    const year = req.body?.year ?? configuration.year
    const slotTimes = getSlotTimes(configuration, year)
    const slotStartMap = new Map(slotTimes.map(([start], index) => [index + 1, start.toJSDate()]))
    const slotEndMap = new Map(slotTimes.map(([, end], index) => [index + 1, end.toJSDate()]))

    const query = `
      SELECT
        g.year AS "Year",
        g.slot_id AS "Slot",
        g.late_start AS "Late Start",
        CASE WHEN g.late_finish THEN 'Yes' ELSE '' END AS "Late Finish",
        g.name AS "Game Name",
        g.gm_names AS "GM Name",
        r.description AS "Room",
        u.full_name AS "GM or Player Name",
        CASE WHEN (ga.gm > 0) THEN 'GM' ELSE '' END AS "GM"
      FROM
        membership m
        JOIN game_assignment ga ON m.id = ga.member_id
        JOIN game g ON g.id = ga.game_id
        JOIN "user" u ON m.user_id = u.id
        LEFT JOIN room r ON g.room_id = r.id
      WHERE
        m.year = ${year}
        AND g.category = 'user'
        AND ga.gm >= 0
      ORDER BY
        g.slot_id,
        g.name,
        ga.gm DESC,
        u.full_name
      `
    await queryToExcelDownload(query, res, {
      refs: [
        {
          name: 'Begin Date/Time',
          lookupKey: 'Slot',
          dictionary: slotStartMap,
          insertAfter: 'Slot',
          format: 'yyyy-mm-dd hh:mm',
        },
        {
          name: 'End Date/Time',
          lookupKey: 'Slot',
          dictionary: slotEndMap,
          insertAfter: 'Begin Date/Time',
          format: 'yyyy-mm-dd hh:mm',
        },
      ],
    })
  } catch (err: any) {
    handleError(err, res)
  }
})
