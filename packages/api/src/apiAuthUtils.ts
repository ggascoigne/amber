import { Session } from '@auth0/nextjs-auth0'
/* eslint-disable @typescript-eslint/no-shadow */
import { getPool, PoolType } from 'database/shared/config'

type AuthInfo = { userId: number; roles: string[] }

const runAdminQuery = async (query: string, values?: any[]) => {
  const pool = getPool(PoolType.ADMIN)
  let result
  let client
  try {
    client = await pool.connect()
    result = await client.query(query, values)
    client.release()
  } catch (error) {
    client?.release()
    console.log(error)
    throw error
  }
  return result
}

const query = `
    select u.email email, u.id user_id, r.authority, r.id role_id
      from "user" u
      join user_role ur on u.id = ur.user_id
      join "role" r on r.id = ur.role_id
      where u.email = $1`

const insertQuery = `
    insert into "user" (id, email) 
      values (default, $1) 
      returning email, id as user_id`

export const getUserRoles = async (session: Session): Promise<AuthInfo | undefined> => {
  // Roles should only be set to verified users.
  // Likewise, user records should only be created for verified users
  if (!session) {
    // really shouldn't be possible
    console.error('No session!')
    return undefined
  }
  if (!session?.user?.email) {
    // really shouldn't be possible
    console.error('User with no email!')
    return undefined
  }
  if (!session?.user?.email_verified) {
    process.env.NODE_ENV !== 'production' && console.log('User not verified')
    return undefined
  }
  if ((session.accessTokenExpiresAt || 0) < new Date().getTime() / 1000) {
    process.env.NODE_ENV !== 'production' && console.log('Session has expired')
    return undefined
  }

  const { email } = session.user
  let authorization
  const res = await runAdminQuery(query, [email])
  if (res.rows.length > 0) {
    authorization = {
      userId: res.rows[0].user_id,
      roles: res.rows.map((r) => r.authority),
    }
  } else {
    // create user
    // roles are handled by a trigger
    const res = await runAdminQuery(insertQuery, [email])
    if (res.rows.length > 0) {
      authorization = {
        userId: res.rows[0].user_id,
        roles: ['ROLE_USER'],
      }
    }
  }
  return authorization
}
