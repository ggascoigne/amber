export type SeededTestUsers = {
  admin: string
  coordinator: string
  member: string
}

export const seededTestUsers: SeededTestUsers = {
  admin: 'alex.admin@example.com',
  coordinator: 'casey.coordinator@example.com',
  member: 'bailey.builder@example.com',
}

export const adminEmails: Array<string> = [seededTestUsers.admin, seededTestUsers.coordinator]
