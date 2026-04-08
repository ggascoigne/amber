import type { CreateMembershipInput, DeleteMembershipInput, UpdateMembershipInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createMembershipRecord = ({ tx, input }: { tx: TransactionClient; input: CreateMembershipInput }) =>
  tx.membership.create({ data: input }).then((membership) => ({ membership }))

export const updateMembershipRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateMembershipInput }) =>
  tx.membership.update({ where: { id: input.id }, data: input.data }).then((membership) => ({ membership }))

export const deleteMembershipRecord = ({ tx, input }: { tx: TransactionClient; input: DeleteMembershipInput }) =>
  tx.membership.delete({ where: { id: input.id } }).then((deletedMembership) => ({
    deletedMembershipId: deletedMembership.id,
  }))
