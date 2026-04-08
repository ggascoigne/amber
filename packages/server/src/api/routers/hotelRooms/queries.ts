import type { TransactionClient } from '../../inRlsTransaction'

const hotelRoomSummarySelect = {
  id: true,
  description: true,
  gamingRoom: true,
  bathroomType: true,
  occupancy: true,
  rate: true,
  type: true,
  quantity: true,
}

export const getHotelRooms = ({ tx }: { tx: TransactionClient }) =>
  tx.hotelRoom.findMany({
    orderBy: { type: 'asc' },
    select: hotelRoomSummarySelect,
  })
