interface Permissions {
  dynamic?: object
  static?: Perms[]
}

export interface Rules {
  [name: string]: Permissions
}

export enum Perms {
  PostsList = 'posts:list',
  HomePageVisit = 'home-page:visit',
  GraphiqlLoad = 'graphiql:load',
  IsAdmin = 'is:Admin',
}

const rules: Rules = {
  ROLE_ADMIN: {
    dynamic: {
      '*': () => true,
    },
  },
  ROLE_USER: {
    static: [Perms.PostsList, Perms.HomePageVisit],
  },
  ROLE_GAME_ADMIN: {},
}

export default rules
