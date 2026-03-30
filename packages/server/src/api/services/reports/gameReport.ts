import type { ReportDefinition } from './types'

export const gameReport: ReportDefinition = {
  buildQuery: ({ abbr, year }) => {
    if (abbr === 'acnw') {
      return `
        SELECT
          g.id AS "Game Id",
          u.full_name AS "Full Name",
          u.first_name AS "First Name",
          u.last_name AS "Last Name",
          u.email AS "email",
          g.name AS "Game Title",
          g.description AS "Description",
          g.genre AS "Genre",
          g.type AS "Type",
          g.teen_friendly AS "Teen Friendly",
          g.setting AS "Setting",
          g.char_instructions AS "Character Instructions",
          g.player_max AS "Player Max",
          g.player_min AS "Player Min",
          g.player_preference AS "Player Preference",
          g.returning_players AS "Returning Players",
          g.players_contact_gm AS "Contact GM",
          g.game_contact_email AS "Game Contact Email",
          g.slot_id AS "Slot",
          g.slot_preference AS "Slot Preference",
          g.slot_conflicts AS "Slot Conflicts",
          g.estimated_length AS "Estimated Length",
          g.gm_names AS "GM Names",
          g.late_start AS "Late Start",
          g.late_finish AS "Late Finish",
          g.message AS "Message"
        FROM
          game g
          JOIN "user" u ON g.author_id = u.id
        WHERE
          g.year = ${year}
      `
    }

    return `
      SELECT
        g.id AS "Game Id",
        u.full_name AS "Full Name",
        u.first_name AS "First Name",
        u.last_name AS "Last Name",
        u.email AS "email",
        g.name AS "Game Title",
        g.description AS "Description",
        g.teen_friendly AS "Teen Friendly",
        g.player_max AS "Player Max",
        g.player_min AS "Player Min",
        g.player_preference AS "Player Preference",
        g.returning_players AS "Returning Players",
        g.players_contact_gm AS "Contact GM",
        g.game_contact_email AS "Game Contact Email",
        g.slot_id AS "Slot",
        g.slot_preference AS "Slot Preference",
        g.gm_names AS "GM Names",
        g.late_start AS "Late Start",
        g.late_finish AS "Late Finish",
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
    `
  },
  supportsSite: () => true,
}
