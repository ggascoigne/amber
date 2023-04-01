-- who hasn't completed submitting choices
SELECT
  u.id AS "user.id",
  m.id AS "member.id",
  u.full_name,
  u.email
FROM
  membership m
  LEFT JOIN "user" u ON m.user_id = u.id
WHERE
  m.id NOT IN (
    SELECT DISTINCT
      member_id
    FROM
      game_submission s
    WHERE
      s.year = 2023
  )
  AND m.year = 2023;


-- who has wonky game coice counts - note that 40 is 35 for NW
JOIN (
  SELECT
    c.member_id,
    COUNT(c.member_id) AS total
  FROM
    game_choice c
  WHERE
    c.year = 2023
  GROUP BY
    c.member_id
) c2 ON (m.id = c2.member_id)
WHERE
  c2.total != 40;


-- game choices
SELECT
  u.id AS "user.id",
  gc.slot_id AS slot,
  g.id AS "game.id",
  m.id AS "member.id",
  u.full_name,
  u.email,
  g.name,
  g.gm_names,
  gc.rank,
  gc.year,
  gc.returning_player,
  s.message
FROM
  game_choice gc
  JOIN game g ON gc.game_id = g.id
  JOIN membership m ON gc.member_id = m.id
  JOIN "user" u ON m.user_id = u.id
  LEFT JOIN game_submission s ON gc.member_id = s.member_id
WHERE
  gc.year = 2023
ORDER BY
  u.id,
  gc.year,
  gc.slot_id,
  gc.rank;