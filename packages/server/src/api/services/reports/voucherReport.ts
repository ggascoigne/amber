import type { ReportDefinition } from './types'

export const voucherReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      u.full_name AS "Member",
      CAST(m.attendance AS INTEGER) AS "Days Attending",
      COALESCE(gm_counts.gm_slots, 0)::integer AS "GM Slots",
      CASE
        WHEN CAST(m.attendance AS INTEGER) = 3 THEN 15
        WHEN CAST(m.attendance AS INTEGER) = 4 THEN 20
        ELSE 0
      END AS "Attendance Vouchers ($)",
      (COALESCE(gm_counts.gm_slots, 0) * 5)::integer AS "GM Vouchers ($)",
      (CASE
        WHEN CAST(m.attendance AS INTEGER) = 3 THEN 15
        WHEN CAST(m.attendance AS INTEGER) = 4 THEN 20
        ELSE 0
      END + COALESCE(gm_counts.gm_slots, 0) * 5)::integer AS "Total Vouchers ($)"
    FROM
      membership m
      JOIN "user" u ON m.user_id = u.id
      LEFT JOIN (
        SELECT ga.member_id, COUNT(*) AS gm_slots
        FROM game_assignment ga
        WHERE ga.gm > 0 AND ga.year = ${year}
        GROUP BY ga.member_id
      ) gm_counts ON gm_counts.member_id = m.id
    WHERE
      m.year = ${year}
      AND m.attending = true
    ORDER BY
      u.full_name
  `,
  supportsSite: (abbr) => abbr === 'acus',
}
