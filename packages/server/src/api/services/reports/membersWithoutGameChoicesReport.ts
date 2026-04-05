import type { ReportDefinition } from './types'

export const membersWithoutGameChoicesReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      u.id AS "UserId",
      m.id AS "MembershipId",
      m.year AS "Year",
      u.full_name AS "FullName",
      u.email AS "Email"
    FROM
      "membership" m
      JOIN "user" u ON m.user_id = u.id
      LEFT JOIN "game_submission" gs ON m.id = gs.member_id
    WHERE
      m.year = ${year}
      AND gs.id IS NULL
    ORDER BY
      u.full_name
  `,
  supportsSite: (abbr) => abbr === 'acus',
}
