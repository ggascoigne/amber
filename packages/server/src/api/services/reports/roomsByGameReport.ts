import type { ReportDefinition } from './types'

export const roomsByGameReport: ReportDefinition = {
  buildQuery: () => `
    SELECT
      g.name AS "Game Name",
      g.gm_names AS "GM Names",
      g.year AS "Year",
      g.slot_id AS "Slot",
      r.description AS "Room"
    FROM
      game g
      INNER JOIN room r ON g.room_id = r.id
    WHERE
      r.type IN ('Presidential Suite', 'Shared Spaces')
    ORDER BY
      g.name,
      g.year,
      g.slot_id
  `,
  supportsSite: (abbr) => abbr === 'acus',
}
