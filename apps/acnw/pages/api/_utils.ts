export const getUserId = (user: any) => user?.userId

export const isAdmin = (user: any) => {
  const roles = user?.roles
  return roles && roles.indexOf('ROLE_ADMIN') !== -1
}
