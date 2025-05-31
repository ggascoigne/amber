-- @param {String} $1:email
INSERT INTO
  "user" (id, email)
VALUES
  (DEFAULT, $1)
RETURNING
  email,
  id AS user_id