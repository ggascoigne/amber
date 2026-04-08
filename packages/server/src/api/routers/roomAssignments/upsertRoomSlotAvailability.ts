import type { UpsertRoomSlotAvailabilityInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const upsertRoomSlotAvailability = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpsertRoomSlotAvailabilityInput
}) => {
  const roomSlotAvailability = await tx.roomSlotAvailability.upsert({
    where: {
      roomId_slotId_year: {
        roomId: input.roomId,
        slotId: input.slotId,
        year: input.year,
      },
    },
    update: {
      isAvailable: input.isAvailable,
    },
    create: {
      roomId: input.roomId,
      slotId: input.slotId,
      year: input.year,
      isAvailable: input.isAvailable,
    },
  })

  return {
    roomSlotAvailability,
  }
}
