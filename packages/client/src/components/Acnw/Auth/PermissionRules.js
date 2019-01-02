const rules = {
  admin: {
    dynamic: {
      '*': () => true
    }
  },
  member: {
    // static: [
    //   'posts:list',
    //   'home-page:visit'
    // ]
  },
  gameAdmin: {}
}

export default rules
