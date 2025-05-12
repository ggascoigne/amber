import * as $runtime from "../runtime/library"

/**
 * @param email
 */
export const getUserWithRoles: (email: string) => $runtime.TypedSql<getUserWithRoles.Parameters, getUserWithRoles.Result>

export namespace getUserWithRoles {
  export type Parameters = [email: string]
  export type Result = {
    email: string
    user_id: number
    authority: string
    role_id: number
  }
}
