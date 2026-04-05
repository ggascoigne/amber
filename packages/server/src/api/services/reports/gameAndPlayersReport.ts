import type { ReportDefinition } from './types'

export const gameAndPlayersReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      g.slot_id AS "Slot",
      g.name AS "Game",
      u.full_name AS "Member",
      CASE
        WHEN (ga.gm > 0) THEN 'GM'
        ELSE ''
      END AS "GM"
    FROM
      membership m
      JOIN game_assignment ga ON m.id = ga.member_id
      JOIN game g ON g.id = ga.game_id
      JOIN "user" u ON m.user_id = u.id
    WHERE
      m.year = ${year}
      AND g.category = 'user'
      AND ga.gm >= 0
    ORDER BY
      "Slot",
      "Game",
      ga.gm DESC,
      "Member"
  `,
  supportsSite: () => true,
}
