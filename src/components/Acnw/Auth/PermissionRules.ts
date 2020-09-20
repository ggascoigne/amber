interface Permissions {
  dynamic?: Record<string, unknown>
  static?: Perms[]
}

export interface Rules {
  [name: string]: Permissions
}

export enum Perms {
  GraphiqlLoad = 'graphiql:load',
  IsAdmin = 'is:Admin',
  IsLoggedIn = 'is:LoggedIn',
}

const rules: Rules = {
  ROLE_ADMIN: {
    dynamic: {
      '*': () => true,
    },
  },
  ROLE_USER: {
    static: [Perms.IsLoggedIn],
  },
  ROLE_GAME_ADMIN: {},
}

export default rules
