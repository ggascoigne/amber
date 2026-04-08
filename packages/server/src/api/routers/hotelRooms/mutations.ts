import type { CreateHotelRoomInput, DeleteHotelRoomInput, UpdateHotelRoomInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createHotelRoomRecord = ({ tx, input }: { tx: TransactionClient; input: CreateHotelRoomInput }) =>
  tx.hotelRoom
    .create({
      data: {
        description: input.description,
        gamingRoom: input.gamingRoom,
        bathroomType: input.bathroomType,
        occupancy: input.occupancy,
        rate: input.rate,
        type: input.type,
        quantity: input.quantity,
      },
    })
    .then((hotelRoom) => ({ hotelRoom }))

export const updateHotelRoomRecord = ({ tx, input }: { tx: TransactionClient; input: UpdateHotelRoomInput }) =>
  tx.hotelRoom
    .update({
      where: { id: input.id },
      data: input.data,
    })
    .then((hotelRoom) => ({ hotelRoom }))

export const deleteHotelRoomRecord = ({ tx, input }: { tx: TransactionClient; input: DeleteHotelRoomInput }) =>
  tx.hotelRoom.delete({ where: { id: input.id } }).then((deletedHotelRoom) => ({
    deletedHotelRoomId: deletedHotelRoom.id,
  }))
