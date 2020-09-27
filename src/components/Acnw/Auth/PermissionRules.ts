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
  FullGameBook = 'gameBook:load',
}

const rules: Rules = {
  ROLE_ADMIN: {
    dynamic: {
      '*': () => true,
    },
  },
  ROLE_GAME_ADMIN: {
    static: [Perms.FullGameBook, Perms.IsLoggedIn],
  },
  ROLE_USER: {
    static: [Perms.IsLoggedIn],
  },
}

export default rules
