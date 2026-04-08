import { transactionInclude } from './queries'
import type { CreateTransactionInput, DeleteTransactionInput, UpdateTransactionInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createTransactionRecord = ({ tx, input }: { tx: TransactionClient; input: CreateTransactionInput }) =>
  tx.transactions
    .create({
      // zod v3 treats any as optional, which is why the router preserves this cast.
      data: input as any,
      include: transactionInclude,
    })
    .then((transaction) => ({ transaction }))

export const deleteTransactionRecord = ({ tx, input }: { tx: TransactionClient; input: DeleteTransactionInput }) =>
  tx.transactions.delete({ where: { id: input.id } }).then((deletedTransaction) => ({
    clientMutationId: null,
    deletedTransactionId: deletedTransaction.id,
  }))

export const updateTransactionRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateTransactionInput }) =>
  tx.transactions
    .update({
      where: { id: input.id },
      data: input.data,
      include: transactionInclude,
    })
    .then((transaction) => ({ transaction }))
