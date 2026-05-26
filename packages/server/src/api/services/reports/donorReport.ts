import type { ReportDefinition } from './types'

const columns = ['Member Id', 'User Id', 'Full Name', 'email', 'Real Donation', 'Address']

export const donorReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      m.id AS "Member Id",
      u.id AS "User Id",
      u.full_name AS "Full Name",
      u.email AS "email",
      NOT m.attending AS "Is Cancelled",
      COALESCE(payments.total_paid, 0) AS "Total Paid",
      profile.snail_mail_address AS "Address"
    FROM
      membership m
      JOIN "user" u ON m.user_id = u.id
      LEFT JOIN (
        SELECT
          t.user_id,
          t.year,
          SUM(t.amount) FILTER (WHERE t.amount > 0) AS total_paid
        FROM
          transactions t
        WHERE
          t.year = ${year}
        GROUP BY
          t.user_id,
          t.year
      ) payments ON payments.user_id = u.id
      AND payments.year = m.year
      LEFT JOIN (
        SELECT
          p.user_id,
          MAX(p.snail_mail_address) AS snail_mail_address
        FROM
          profile p
        GROUP BY
          p.user_id
      ) profile ON profile.user_id = u.id
    WHERE
      m.year = ${year}
    ORDER BY
      u.full_name
  `,
  supportsSite: (abbr) => abbr === 'acnw',
  transform: (rows, options) => ({
    columns,
    columnFormats: [{ column: 'Real Donation', format: '$0.00' }],
    rows: rows
      .map((row) => {
        const isCancelled = row['Is Cancelled'] === true
        const totalPaid = typeof row['Total Paid'] === 'number' ? row['Total Paid'] : 0
        const realCost = isCancelled ? 0 : options.fourDayMembership
        const realDonation = Math.max(totalPaid - realCost, 0)

        return {
          'Member Id': row['Member Id'] ?? null,
          'User Id': row['User Id'] ?? null,
          'Full Name': row['Full Name'] ?? null,
          email: row.email ?? null,
          'Real Donation': realDonation,
          Address: row.Address ?? null,
        }
      })
      .filter((row) => row['Real Donation'] > 0),
    sheetName: 'Donors',
  }),
}
