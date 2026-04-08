import type { GetLookupValuesInput, GetSingleLookupValueInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const getLookups = ({ tx }: { tx: TransactionClient }) =>
  tx.lookup.findMany({
    orderBy: { realm: 'asc' },
    include: {
      lookupValue: {
        orderBy: { sequencer: 'asc' },
      },
    },
  })

export const getLookupValues = ({ tx, input }: { tx: TransactionClient; input: GetLookupValuesInput }) =>
  tx.lookup.findMany({
    where: { realm: input.realm },
    include: {
      lookupValue: {
        orderBy: { value: 'asc' },
      },
    },
  })

export const getSingleLookupValue = ({ tx, input }: { tx: TransactionClient; input: GetSingleLookupValueInput }) =>
  tx.lookup.findMany({
    where: { realm: input.realm },
    include: {
      lookupValue: {
        where: { code: input.code },
      },
    },
  })
