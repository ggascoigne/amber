SELECT DISTINCT
  u.*
FROM
  "user" u
  JOIN membership m ON u.id = m.user_id
  JOIN game_assignment ga ON ga.member_id = m.id
WHERE
  ga.gm != 0
  AND ga.year = 2020;