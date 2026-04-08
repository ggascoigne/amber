import type { CreateProfileInput, UpdateProfileInput, UpdateUserInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const updateUserRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateUserInput }) =>
  tx.user.update({ where: { id: input.id }, data: input.data }).then((user) => ({ user }))

export const createProfileRecord = ({ tx, input }: { tx: TransactionClient; input: CreateProfileInput }) =>
  tx.profile
    .create({
      data: {
        userId: input.userId,
        phoneNumber: input.phoneNumber,
        snailMailAddress: input.snailMailAddress,
      },
    })
    .then((profile) => ({ profile }))

export const updateProfileRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateProfileInput }) =>
  tx.profile.update({ where: { id: input.id }, data: input.data }).then((profile) => ({ profile }))
