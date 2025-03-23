-- @param {String} $1:email
SELECT
  u.email email,
  u.id user_id,
  r.authority,
  r.id role_id
FROM
  "user" u
  JOIN user_role ur ON u.id = ur.user_id
  JOIN "role" r ON r.id = ur.role_id
WHERE
  u.email = $1
