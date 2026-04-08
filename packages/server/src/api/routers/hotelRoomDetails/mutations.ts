import type { CreateHotelRoomDetailInput, DeleteHotelRoomDetailInput, UpdateHotelRoomDetailInput } from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

export const createHotelRoomDetailRecord = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: CreateHotelRoomDetailInput
}) =>
  tx.hotelRoomDetails
    .create({
      data: {
        name: input.name,
        roomType: input.roomType,
        comment: input.comment ?? '',
        reservedFor: input.reservedFor ?? '',
        bathroomType: input.bathroomType,
        gamingRoom: input.gamingRoom,
        enabled: input.enabled,
        formattedRoomType: input.formattedRoomType ?? '',
        internalRoomType: input.internalRoomType ?? '',
        reserved: input.reserved ?? false,
        version: 1,
      },
    })
    .then((hotelRoomDetail) => ({ hotelRoomDetail }))

export const updateHotelRoomDetailRecord = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: UpdateHotelRoomDetailInput
}) =>
  tx.hotelRoomDetails
    .update({
      where: { id: input.id },
      data: input.data,
    })
    .then((hotelRoomDetail) => ({ hotelRoomDetail }))

export const deleteHotelRoomDetailRecord = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: DeleteHotelRoomDetailInput
}) =>
  tx.hotelRoomDetails.delete({ where: { id: input.id } }).then((deletedHotelRoomDetail) => ({
    deletedHotelRoomDetail: deletedHotelRoomDetail.id,
  }))
