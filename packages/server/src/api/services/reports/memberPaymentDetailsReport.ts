import type { ReportDefinition } from './types'

import type { ReportRow } from '../../contracts/reports'

const columns = [
  'Member Id',
  'User Id',
  'Full Name',
  'First Name',
  'Last Name',
  'email',
  'Attendance',
  'Room',
  'Is Cancelled',
  'User Chosen Cost',
  'Real Cost',
  'Balance',
  'Payment Count',
  'Total Paid',
  'Total Donated',
  'Real Donation',
  'Real Assistance Given',
  'Net Transactions',
  'Last Payment Date',
  'Payment Notes',
]

export const memberPaymentDetailsReport: ReportDefinition = {
  buildQuery: ({ year }) => `
    SELECT
      m.id AS "Member Id",
      u.id AS "User Id",
      u.full_name AS "Full Name",
      u.first_name AS "First Name",
      u.last_name AS "Last Name",
      u.email AS "email",
      m.attendance AS "Attendance",
      h.description AS "Room",
      NOT m.attending AS "Is Cancelled",
      COALESCE(m.cost, 0) AS "User Chosen Cost",
      u.balance AS "Balance",
      COALESCE(payments.payment_count, 0)::integer AS "Payment Count",
      COALESCE(payments.total_paid, 0) AS "Total Paid",
      COALESCE(payments.total_donated, 0) AS "Total Donated",
      COALESCE(payments.net_transactions, 0) AS "Net Transactions",
      payments.last_payment_date AS "Last Payment Date",
      payments.payment_notes AS "Payment Notes"
    FROM
      membership m
      JOIN "user" u ON m.user_id = u.id
      JOIN hotel_room h ON m.hotel_room_id = h.id
      LEFT JOIN (
        SELECT
          t.user_id,
          t.year,
          COUNT(*) FILTER (WHERE t.amount > 0) AS payment_count,
          SUM(t.amount) FILTER (WHERE t.amount > 0) AS total_paid,
          SUM(ABS(t.amount)) FILTER (
            WHERE
              t.amount < 0
              AND (
                t.notes = 'Donation'
                OR t.data ->> 'type' = 'donation payment'
              )
          ) AS total_donated,
          SUM(t.amount) AS net_transactions,
          MAX(t.timestamp) FILTER (WHERE t.amount > 0) AS last_payment_date,
          STRING_AGG(DISTINCT NULLIF(t.notes, ''), '; ' ORDER BY NULLIF(t.notes, '')) AS payment_notes
        FROM
          transactions t
        WHERE
          t.year = ${year}
        GROUP BY
          t.user_id,
          t.year
      ) payments ON payments.user_id = u.id
      AND payments.year = m.year
    WHERE
      m.year = ${year}
    ORDER BY
      u.full_name
  `,
  supportsSite: (abbr) => abbr === 'acnw',
  transform: (rows, options) => {
    const reportRows: Array<ReportRow> = rows.map((row) => {
      const isCancelled = row['Is Cancelled'] === true
      const totalPaid = typeof row['Total Paid'] === 'number' ? row['Total Paid'] : 0
      const realCost = isCancelled ? 0 : options.fourDayMembership

      return {
        ...row,
        'Real Cost': realCost,
        'Real Donation': Math.max(totalPaid - realCost, 0),
        'Real Assistance Given': Math.max(realCost - totalPaid, 0),
      }
    })

    const sumColumn = (column: string) =>
      reportRows.reduce((total, row) => total + (typeof row[column] === 'number' ? row[column] : 0), 0)

    return {
      columns,
      columnFormats: [
        { column: 'User Chosen Cost', format: '$0.00' },
        { column: 'Real Cost', format: '$0.00' },
        { column: 'Balance', format: '$0.00' },
        { column: 'Total Paid', format: '$0.00' },
        { column: 'Total Donated', format: '$0.00' },
        { column: 'Real Donation', format: '$0.00' },
        { column: 'Real Assistance Given', format: '$0.00' },
        { column: 'Net Transactions', format: '$0.00' },
        { column: 'Last Payment Date', format: 'yyyy-mm-dd hh:mm' },
      ],
      rows: [
        ...reportRows,
        {
          'Member Id': null,
          'User Id': null,
          'Full Name': 'TOTAL',
          'First Name': null,
          'Last Name': null,
          email: null,
          Attendance: null,
          Room: null,
          'Is Cancelled': null,
          'User Chosen Cost': sumColumn('User Chosen Cost'),
          'Real Cost': sumColumn('Real Cost'),
          Balance: null,
          'Payment Count': null,
          'Total Paid': sumColumn('Total Paid'),
          'Total Donated': sumColumn('Total Donated'),
          'Real Donation': sumColumn('Real Donation'),
          'Real Assistance Given': sumColumn('Real Assistance Given'),
          'Net Transactions': sumColumn('Net Transactions'),
          'Last Payment Date': null,
          'Payment Notes': null,
        },
      ],
      sheetName: 'Member Payments',
    }
  },
}
