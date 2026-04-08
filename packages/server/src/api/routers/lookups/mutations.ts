import { debug } from 'debug'

import type {
  CreateLookupInput,
  CreateLookupValueInput,
  DeleteLookupInput,
  DeleteLookupValueInput,
  UpdateLookupInput,
  UpdateLookupValueInput,
} from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const log = debug('amber:server:api:routers:lookups')

const lookupDefaultData = {
  codeMaximum: null,
  codeMinimum: null,
  codeScale: null,
  codeType: 'string',
  internationalize: false,
  ordering: 'sequencer',
  valueMaximum: null,
  valueMinimum: null,
  valueScale: null,
  valueType: 'string',
}

export const createLookupRecord = async ({ tx, input }: { tx: TransactionClient; input: CreateLookupInput }) => {
  const lookup = await tx.lookup.create({
    data: {
      realm: input.realm,
      ...lookupDefaultData,
    },
  })

  log('createLookup', lookup)

  return { lookup, update: false }
}

export const updateLookupRecord = async ({ tx, input }: { tx: TransactionClient; input: UpdateLookupInput }) => {
  const lookup = await tx.lookup.update({
    where: { id: input.id },
    data: {
      realm: input.realm,
    },
  })

  log('updateLookup', lookup)

  return { lookup, update: true }
}

export const deleteLookupRecord = async ({ tx, input }: { tx: TransactionClient; input: DeleteLookupInput }) => {
  const deletedLookup = await tx.lookup.delete({
    where: { id: input.id },
  })

  log('deleteLookup', deletedLookup)

  return {
    deletedLookupId: deletedLookup.id,
  }
}

export const createLookupValueRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: CreateLookupValueInput
}) => {
  const lookupValue = await tx.lookupValue.create({
    data: {
      lookupId: input.lookupId,
      code: input.code,
      sequencer: input.sequencer,
      value: input.value,
      numericSequencer: 0,
      stringSequencer: '_',
    },
  })

  log('createLookupValue', lookupValue)

  return { lookupValue, update: false }
}

export const updateLookupValueRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpdateLookupValueInput
}) => {
  const lookupValue = await tx.lookupValue.update({
    where: { id: input.id },
    data: {
      code: input.code,
      sequencer: input.sequencer,
      value: input.value,
    },
  })

  log('updateLookupValue', lookupValue)

  return { lookupValue, update: true }
}

export const deleteLookupValueRecord = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: DeleteLookupValueInput
}) => {
  const deletedLookupValue = await tx.lookupValue.delete({
    where: { id: input.id },
  })

  log('deleteLookupValue', deletedLookupValue)

  return {
    deletedLookupValueId: deletedLookupValue.id,
  }
}
