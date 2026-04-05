import type { ReportDefinition } from './types'

export const membershipReport: ReportDefinition = {
  buildQuery: ({ abbr, virtual, year }) => {
    if (virtual) {
      return `
        SELECT
          m.id AS "Member Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          u.balance AS "Balance",
          m.slots_attending AS "Slots Attending",
          COALESCE(gm.isGm, FALSE) AS "isGM",
          m.message AS "Message"
        FROM
          membership m
          JOIN "user" u ON m.user_id = u.id
          LEFT JOIN (
            SELECT DISTINCT
              m.id,
              TRUE AS isGm
            FROM
              membership m
              JOIN game_assignment ga ON ga.member_id = m.id
            WHERE
              m.year = ${year}
              AND ga.gm < 0
          ) gm ON gm.id = m.id
        WHERE
          m.year = ${year}
        ${abbr === 'acus' ? 'ORDER BY u.full_name' : ''}
      `
    }

    if (abbr === 'acnw') {
      return `
        SELECT
          m.id AS "Member Id",
          u.id AS "User Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          u.balance AS "Balance",
          h.description AS "Room",
          COALESCE(gm.isGm, FALSE) AS "isGM",
          mc.times_attending AS "Times Attending",
          m.arrival_date AS "Arriving",
          m.departure_date AS "Departing",
          m.attending AS "isAttending",
          m.attendance AS "Attendance",
          m.request_old_price AS "Requests Subsidy",
          m.volunteer AS "isVolunteer",
          m.rooming_with AS "Rooming With",
          m.room_preference_and_notes AS "Room Preferences/Notes",
          m.message AS "Message"
        FROM
          membership m
          JOIN "user" u ON m.user_id = u.id
          LEFT JOIN (
            SELECT DISTINCT
              m.id,
              TRUE AS isGm
            FROM
              membership m
              JOIN game_assignment ga ON ga.member_id = m.id
            WHERE
              m.year = ${year}
              AND ga.gm < 0
          ) gm ON gm.id = m.id
          JOIN hotel_room h ON m.hotel_room_id = h.id
          LEFT JOIN (
            SELECT
              m.user_id,
              COUNT(m.user_id) AS times_attending
            FROM
              membership m
            GROUP BY
              m.user_id
          ) mc ON u.id = mc.user_id
        WHERE
          m.year = ${year}
      `
    }

    return `
      SELECT
        m.id AS "Member Id",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        u.email AS "email",
        u.balance AS "Balance",
        COALESCE(gm.isGm, FALSE) AS "isGM",
        gmc.times_gming AS "timesGMing",
        mc.times_attending AS "Times Attending",
        m.attending AS "isAttending",
        m.attendance AS "daysAttending",
        m.attendance AS "Attendance",
        m.volunteer AS "isVolunteer",
        m.message AS "Message"
      FROM
        membership m
        JOIN "user" u ON m.user_id = u.id
        LEFT JOIN (
          SELECT DISTINCT
            m.id,
            TRUE AS isGm
          FROM
            membership m
            JOIN game_assignment ga ON ga.member_id = m.id
          WHERE
            m.year = ${year}
            AND ga.gm < 0
        ) gm ON gm.id = m.id
        JOIN hotel_room h ON m.hotel_room_id = h.id
        LEFT JOIN (
          SELECT
            m.user_id,
            COUNT(m.user_id) AS times_attending
          FROM
            membership m
          GROUP BY
            m.user_id
        ) mc ON u.id = mc.user_id
        LEFT JOIN (
          SELECT
            ga.member_id,
            ga.year,
            COUNT(ga.member_id) AS times_gming
          FROM
            game_assignment ga
            JOIN game g ON ga.game_id = g.id
          WHERE
            ga.gm < 0
            AND g.slot_id >= 1
            AND g.slot_id <= 8
          GROUP BY
            ga.member_id,
            ga.year
        ) gmc ON m.id = gmc.member_id
        AND m.year = gmc.year
      WHERE
        m.year = ${year}
      ORDER BY
        u.full_name
    `
  },
  supportsSite: () => true,
}
