import { isDev } from '@amber/environment'
import { Session } from '@auth0/nextjs-auth0'
import { getUserWithRoles, createUser } from '@prisma/client/sql'

import { dbAdmin } from '../db'

type AuthInfo = { userId: number; roles: string[] }

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
    isDev && console.log('User not verified')
    return undefined
  }
  if ((session.accessTokenExpiresAt ?? 0) < new Date().getTime() / 1000) {
    isDev && console.log('Session has expired')
    return undefined
  }

  const { email } = session.user
  const selectRows = await dbAdmin.$queryRawTyped(getUserWithRoles(email))
  if (selectRows.length > 0) {
    return {
      userId: selectRows[0]!.user_id,
      roles: selectRows.map((r) => r.authority),
    }
  } else {
    // roles are handled by a trigger
    const insertRows = await dbAdmin.$queryRawTyped(createUser(email))
    return insertRows.length > 0
      ? {
          userId: insertRows[0]!.user_id,
          roles: ['ROLE_USER'],
        }
      : undefined
  }
}
