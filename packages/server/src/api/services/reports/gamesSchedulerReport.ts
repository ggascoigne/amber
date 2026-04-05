import type { ReportDefinition } from './types'

export const gamesSchedulerReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      g.id AS "Game ID",
      u.full_name AS "Submitted By",
      u.email AS "Email",
      g.name AS "Game Title",
      g.gm_names AS "GM Names",
      g.description AS "Description",
      g.teen_friendly AS "Teen Friendly",
      g.player_min AS "Player Min",
      g.player_max AS "Player Max",
      g.player_preference AS "Player Preference",
      g.slot_id AS "Slot",
      g.slot_preference AS "Slot Preference",
      g.message AS "Message"
    FROM
      game g
      JOIN "user" u ON g.author_id = u.id
    WHERE
      g.year = ${year}
    ORDER BY
      g.year,
      g.slot_id,
      g.name
  `,
  supportsSite: (abbr) => abbr === 'acus',
}
