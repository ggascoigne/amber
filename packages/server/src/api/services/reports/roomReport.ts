import type { ReportDefinition } from './types'

export const roomReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT DISTINCT
      h.id,
      h.description,
      h.quantity,
      COALESCE(hr.allocated, 0) AS allocated,
      h.gaming_room,
      h.bathroom_type,
      h.type
    FROM
      hotel_room h
      JOIN membership m ON m.hotel_room_id = h.id
      LEFT JOIN (
        SELECT
          m.hotel_room_id AS id,
          COUNT(m.hotel_room_id) AS allocated
        FROM
          membership m
        WHERE
          YEAR = ${year}
        GROUP BY
          m.hotel_room_id
      ) hr ON h.id = hr.id
    ORDER BY
      h.id
  `,
  supportsSite: (abbr) => abbr === 'acnw',
}
