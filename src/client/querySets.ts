export const allMembershipQueries = [
  'getMembershipByYearAndId',
  'getMembershipsByYear',
  'getMembershipsById',
  'getMembershipByYearAndRoom',
]

export const allProfileQueries = ['getUserByEmail', 'getAllUsersAndProfiles']

export const allUserQueries = [
  ...allMembershipQueries,
  ...allProfileQueries,
  'getUserById',
  'getAllUsers',
  'getAllUsersBy',
]
