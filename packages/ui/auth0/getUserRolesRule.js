// Auth0 rule for hooking up user data from the database with the access token

function(user, context, callback) {

  const namespace = 'https://amberconnw.org';

  const query = `select p.id profile_id, p.email, u.id user_id, r.authority, r.id role_id
        from profile p join "user" u on p.id = u.profile_id
        join user_role ur on u.id = ur.user_id
        join "role" r on r.id = ur.role_id
        where p.email = $1`;

  const pg = require('pg@7.17.1');

  // Roles should only be set to verified users.
  if (!user.email || !user.email_verified) {
    return callback(null, user, context);
  }

  const client = new pg.Client({
    user: configuration.DATABASE_USER,
    host: configuration.DATABASE_HOST,
    database: configuration.DATABASE_NAME,
    password: configuration.DATABASE_PASSWORD,
    port: configuration.DATABASE_PORT,
    ssl: true
  });

  client.connect()
    .then(() => {
      client.query(query, [user.email])
        .then(res => {
          if(res.rows.length > 0) {
            context.accessToken[namespace] = {
              userId: res.rows[0].user_id,
              roles: res.rows.map(r => r.authority)
            };
          }
          client.end();
          return callback(null, user, context);
        })
        .catch(e => {
          client.end();
          return callback(e);
        });
    })
    .catch(e => {
      client.end();
      return callback(e);
    });
}
