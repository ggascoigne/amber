-- @param {BigInt} $1:id
SELECT
  t.id,
  t.user_id AS "userId",
  t.member_id AS "memberId",
  t.year,
  t.timestamp,
  t.amount,
  t.origin,
  t.stripe,
  t.notes,
  t.data,
  u.id AS user_id,
  u.full_name AS user_full_name,
  origin_user.id AS origin_user_id,
  origin_user.full_name AS origin_user_full_name,
  m.year AS membership_year
FROM transactions t
JOIN "user" u
  ON u.id = t.user_id
LEFT JOIN "user" origin_user
  ON origin_user.id = t.origin
LEFT JOIN membership m
  ON m.id = t.member_id
WHERE
  t.id = $1
