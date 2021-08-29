export interface CommandOption {
  name: string
  description: string
  type: number
  required: boolean
}

export interface Command {
  name: string
  description: string
  options?: Array<CommandOption>
}

export interface User {
  avatar: string
  discriminator: string
  id: string
  public_flags: number
  username: string
}

export interface Member {
  avatar: null | string
  deaf: boolean
  is_pending: boolean
  joined_at: string
  mute: boolean
  nick: null | string
  pending: boolean
  permissions: string
  premium_since: null
  roles: unknown
  user?: User
}

export interface MessageOption {
  name: string
  type: number
  value: string
}

export interface Resolved {
  members?: Record<string, Member>
  users?: Record<string, User>
}

export interface Message {
  application_id: string
  channel_id: string
  data: {
    id: string
    name: string
    options?: Array<MessageOption>
    resolved?: Resolved
    type: number
  }
  guild_id: string
  id: string
  member: Member
  token: string
  type: number
  version: number
}
