import * as $runtime from "../runtime/library"

/**
 * @param email
 */
export const createUser: (email: string) => $runtime.TypedSql<createUser.Parameters, createUser.Result>

export namespace createUser {
  export type Parameters = [email: string]
  export type Result = {
    email: string
    user_id: number
  }
}
