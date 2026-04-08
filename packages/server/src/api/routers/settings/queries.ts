import type { TransactionClient } from '../../inRlsTransaction'

export const getSettings = ({ tx }: { tx: TransactionClient }) =>
  tx.setting.findMany({
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
    },
  })
