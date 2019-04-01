interface Permissions {
  dynamic?: object
  static?: Perms[]
}

export interface Rules {
  [name: string]: Permissions
}

export enum Perms {
  PostsList = 'posts:list',
  HomePageVisit = 'home-page:visit'
}

const rules: Rules = {
  admin: {
    dynamic: {
      '*': () => true
    }
  },
  member: {
    static: [Perms.PostsList, Perms.HomePageVisit]
  },
  gameAdmin: {}
}

export default rules
