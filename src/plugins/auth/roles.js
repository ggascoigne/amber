import scopes from './scopes'

// export default {
//   'god-mode': Object.keys(scopes),
//   'iam-super': Object.keys(scopes).filter(s => s.match(/^iam:/)),
//   'iam-admin': Object.keys(scopes).filter(s => s.match(/^iam:.+(!:delete)$/)),
//   'iam-user': Object.keys(scopes).filter(s => s.match(/^iam:.+(!:(write|delete))$/)),
//   'data-super': Object.keys(scopes).filter(s => s.match(/^data:/)),
//   'data-admin': Object.keys(scopes).filter(s => s.match(/^data:.+(!:delete)$/)),
//   'data-user': Object.keys(scopes).filter(s => s.match(/^data:.+(!:(write|delete))$/)),
//   'worker-user': Object.keys(scopes).filter(s => s.match(/^worker:/))
// }

export default {
  'ROLE_ADMIN': Object.keys(scopes),
  'ROLE_USER': Object.keys(scopes),
  'ROLE_GAME_ADMIN': Object.keys(scopes),
  'ROLE_TOKEN_REFRESH': ['acnw:auth:refresh'],
  // todo trim this
  'iam-super': Object.keys(scopes).filter(s => s.match(/^iam:/)),
  'iam-admin': Object.keys(scopes).filter(s => s.match(/^iam:.+(!:delete)$/)),
  'iam-user': Object.keys(scopes).filter(s => s.match(/^iam:.+(!:(write|delete))$/)),
  'data-super': Object.keys(scopes).filter(s => s.match(/^data:/)),
  'data-admin': Object.keys(scopes).filter(s => s.match(/^data:.+(!:delete)$/)),
  'data-user': Object.keys(scopes).filter(s => s.match(/^data:.+(!:(write|delete))$/)),
  'worker-user': Object.keys(scopes).filter(s => s.match(/^worker:/))
}
