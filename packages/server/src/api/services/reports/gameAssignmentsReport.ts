import { slotDateTimePairsByCount } from '@amber/shared'

import type { ReportDefinition } from './types'

export const gameAssignmentsReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      g.year AS "Year",
      g.slot_id AS "Slot",
      CASE WHEN g.late_start = 'Starts on time' THEN '' ELSE g.late_start END AS "Late Start",
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
  `,
  supportsSite: (abbr) => abbr === 'acus',
  transform: (rows, options) => {
    const slotTimes =
      options.start && options.numberOfSlots > 0
        ? slotDateTimePairsByCount(options.start, options.numberOfSlots, options.virtual)
        : []

    return {
      columns: [
        'Year',
        'Slot',
        'Begin Date/Time',
        'End Date/Time',
        'Late Start',
        'Late Finish',
        'Game Name',
        'GM Name',
        'Room',
        'GM or Player Name',
        'GM',
      ],
      columnFormats: [
        { column: 'Begin Date/Time', format: 'yyyy-mm-dd hh:mm' },
        { column: 'End Date/Time', format: 'yyyy-mm-dd hh:mm' },
      ],
      rows: rows.map((row) => {
        const slotValue = typeof row.Slot === 'number' ? row.Slot : parseInt(String(row.Slot ?? ''), 10)
        const slotPair = slotTimes[slotValue - 1]

        return {
          Year: row.Year ?? null,
          Slot: row.Slot ?? null,
          'Begin Date/Time': slotPair ? slotPair[0].toJSDate() : null,
          'End Date/Time': slotPair ? slotPair[1].toJSDate() : null,
          'Late Start': row['Late Start'] ?? null,
          'Late Finish': row['Late Finish'] ?? null,
          'Game Name': row['Game Name'] ?? null,
          'GM Name': row['GM Name'] ?? null,
          Room: row.Room ?? null,
          'GM or Player Name': row['GM or Player Name'] ?? null,
          GM: row.GM ?? null,
        }
      }),
      sheetName: 'Sheet1',
    }
  },
}
