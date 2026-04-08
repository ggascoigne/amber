import type { TransactionClient } from '../../inRlsTransaction'

const hotelRoomDetailsSummarySelect = {
  id: true,
  name: true,
  roomType: true,
  comment: true,
  reservedFor: true,
  bathroomType: true,
  gamingRoom: true,
  enabled: true,
  formattedRoomType: true,
  internalRoomType: true,
  reserved: true,
}

export const getHotelRoomDetails = ({ tx }: { tx: TransactionClient }) =>
  tx.hotelRoomDetails.findMany({
    orderBy: { name: 'asc' },
    select: hotelRoomDetailsSummarySelect,
  })
