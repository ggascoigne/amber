import type { ReportDefinition } from './types'

export const discordGameReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      CONCAT(
        g.slot_id,
        LPAD(
          CAST(
            ROW_NUMBER() OVER (
              PARTITION BY
                g.slot_id
              ORDER BY
                g.name
            ) AS VARCHAR
          ),
          2,
          '0'
        )
      ) AS "GameNumber",
      g.slot_id AS "Slot",
      g.name AS "Game Title",
      g.id AS "Game Id",
      u.full_name AS "Author",
      g.gm_names AS "GM Names",
      r.description AS "Room"
    FROM
      game g
      JOIN "user" u ON g.author_id = u.id
      LEFT JOIN room r ON g.room_id = r.id
    WHERE
      g.year = ${year}
      AND g.slot_id > 0
    ORDER BY
      "Slot",
      "Game Title"
  `,
  supportsSite: (abbr) => abbr === 'acnw',
}
