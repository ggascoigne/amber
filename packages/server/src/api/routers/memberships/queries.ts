import type {
  GetAllMembersByInput,
  GetMembershipByYearAndIdInput,
  GetMembershipByYearAndRoomInput,
  GetMembershipsByIdInput,
  GetMembershipsByYearInput,
} from './schemas'

import type { TransactionClient } from '../../inRlsTransaction'

const membershipWithUserInclude = {
  user: {
    include: {
      profile: true,
    },
  },
}

const membershipWithUserAndRoomInclude = {
  ...membershipWithUserInclude,
  hotelRoom: true,
}

export const getMembershipByYearAndId = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetMembershipByYearAndIdInput
}) =>
  tx.membership.findMany({
    where: {
      year: input.year,
      userId: input.userId,
    },
    include: membershipWithUserAndRoomInclude,
  })

export const getMembershipsByYear = ({ tx, input }: { tx: TransactionClient; input: GetMembershipsByYearInput }) =>
  tx.membership.findMany({
    where: { year: input.year },
    include: membershipWithUserAndRoomInclude,
  })

export const getMembershipsById = ({ tx, input }: { tx: TransactionClient; input: GetMembershipsByIdInput }) =>
  tx.membership.findMany({
    where: { id: input.id },
    include: membershipWithUserAndRoomInclude,
  })

export const getMembershipByYearAndRoom = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetMembershipByYearAndRoomInput
}) =>
  tx.membership.findMany({
    where: {
      year: input.year,
      hotelRoomId: input.hotelRoomId,
    },
    include: membershipWithUserAndRoomInclude,
  })

export const getAllMembersBy = ({ tx, input }: { tx: TransactionClient; input: GetAllMembersByInput }) =>
  tx.user.findMany({
    where: {
      fullName: {
        contains: input.query,
        mode: 'insensitive',
      },
    },
    orderBy: { lastName: 'asc' },
    include: {
      membership: {
        where: {
          attending: true,
          year: input.year,
        },
        include: membershipWithUserInclude,
      },
    },
  })
