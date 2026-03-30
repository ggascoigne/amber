import type { ReportDefinition } from './types'

export const roomsByRoomReport: ReportDefinition = {
  buildQuery: () => `
    SELECT
      r.description AS "Room",
      g.year AS "Year",
      g.slot_id AS "Slot",
      g.name AS "Game Name",
      g.gm_names AS "GM Names"
    FROM
      game g
      INNER JOIN room r ON g.room_id = r.id
    WHERE
      r.type IN ('Presidential Suite', 'Shared Spaces')
    ORDER BY
      r.description,
      g.slot_id,
      g.year
  `,
  supportsSite: (abbr) => abbr === 'acus',
}
