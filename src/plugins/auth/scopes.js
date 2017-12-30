import keymirror from 'keymirror'

// scope === <service>:[<domain(s)>]:action
export default keymirror({
  'acnw:auth:check': null,
  'acnw:authenticate': null,
  'acnw:auth:refresh': null,
  'acnw:pwreset': null,
  'acnw:tokens:create': null,
  'acnw:tokens:read': null,
  'acnw:tokens:delete': null,
  'acnw:users:create': null,
  'acnw:users:read': null,
  'acnw:users:delete': null,
  'data:users:read': null,
  'data:users:write': null,
  'data:users:delete': null,
  'data:profiles:read': null,
  'data:profiles:write': null,
  'data:profiles:delete': null,
  'worker:query': null
})
