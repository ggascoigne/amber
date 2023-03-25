SELECT
  u.id AS "user.id",
  u.full_name,
  u.email,
  COUNT(DISTINCT s.id) AS "slot_choices"
FROM
  membership m
  LEFT JOIN game_choice gc ON gc.member_id = m.id
  LEFT JOIN game g ON gc.game_id = g.id
  LEFT JOIN slot s ON g.slot_id = s.id
  LEFT JOIN "user" u ON m.user_id = u.id
WHERE
  m.year = 2023
GROUP BY
  u.id,
  u.full_name,
  u.email
ORDER BY
  full_name