import type { ReportDefinition } from './types'

export const gmReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT DISTINCT
      m.id AS "Member Id",
      u.full_name AS "Full Name",
      u.first_name AS "First Name",
      u.last_name AS "Last Name",
      u.email AS "email"
    FROM
      membership m
      JOIN "user" u ON m.user_id = u.id
      JOIN game_assignment ga ON ga.member_id = m.id
    WHERE
      m.year = ${year}
      AND ga.gm < 0
    ORDER BY
      "Full Name"
  `,
  supportsSite: () => true,
}
