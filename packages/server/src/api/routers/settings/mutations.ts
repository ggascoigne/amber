import type { CreateSettingInput, DeleteSettingInput, UpdateSettingInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createSettingRecord = ({ tx, input }: { tx: TransactionClient; input: CreateSettingInput }) =>
  tx.setting
    .create({
      data: {
        code: input.code,
        type: input.type,
        value: input.value,
      },
    })
    .then((setting) => ({ setting }))

export const deleteSettingRecord = ({ tx, input }: { tx: TransactionClient; input: DeleteSettingInput }) =>
  tx.setting.delete({ where: { id: input.id } }).then((deletedSetting) => ({
    deletedSettingId: deletedSetting.id,
  }))

export const updateSettingRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateSettingInput }) =>
  tx.setting
    .update({
      where: { id: input.id },
      data: {
        code: input.code,
        type: input.type,
        value: input.value,
      },
    })
    .then((setting) => ({ setting }))
