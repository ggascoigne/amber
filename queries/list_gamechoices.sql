SELECT
  u.id AS "user.id",
  s.id AS "slot.id",
  g.id AS "game.id",
  m.id AS "member.id",
  u.full_name,
  u.email,
  s.slot,
  g.name,
  g.gm_names,
  gc.rank,
  gc.year,
  gc.returning_player
FROM
  game_choice gc
  JOIN game g ON gc.game_id = g.id
  JOIN slot s ON g.slot_id = s.id
  JOIN membership m ON gc.member_id = m.id
  JOIN "user" u ON m.user_id = u.id
WHERE
  gc.year = 2023
ORDER BY
  u.id,
  gc.year,
  s.slot,
  gc.rank