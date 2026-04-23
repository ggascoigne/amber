import type {
  GetAllMembersByInput,
  GetMembershipByYearAndIdInput,
  GetMembershipByYearAndRoomInput,
  GetMembershipsByIdInput,
  GetMembershipsByYearInput,
} from './schemas'

import type { Prisma } from '../../../generated/prisma/client'
import * as membershipSql from '../../../generated/prisma/sql'
import type { TransactionClient } from '../../inRlsTransaction'

type MembershipProfileResult = Prisma.ProfileGetPayload<{
  select: {
    id: true
    userId: true
    snailMailAddress: true
    phoneNumber: true
    roomAccessibilityPreference: true
  }
}>

type MembershipUserResult = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    fullName: true
    firstName: true
    lastName: true
    displayName: true
    balance: true
  }
}> & {
  profile: Array<MembershipProfileResult>
}

type MembershipHotelRoomResult = Prisma.HotelRoomGetPayload<{
  select: {
    id: true
    description: true
    gamingRoom: true
    occupancy: true
    quantity: true
    rate: true
    bathroomType: true
    type: true
  }
}>

type MembershipResult = Prisma.MembershipGetPayload<{
  select: {
    id: true
    arrivalDate: true
    attendance: true
    attending: true
    departureDate: true
    hotelRoomId: true
    interestLevel: true
    message: true
    roomPreferenceAndNotes: true
    roomingPreferences: true
    roomingWith: true
    userId: true
    volunteer: true
    year: true
    offerSubsidy: true
    requestOldPrice: true
    slotsAttending: true
    cost: true
  }
}> & {
  hotelRoom: MembershipHotelRoomResult
  user: MembershipUserResult
}

type MembershipJoinRow = Omit<
  membershipSql.getMembershipsByYear.Result,
  | 'profile_id'
  | 'profile_user_id'
  | 'profile_snail_mail_address'
  | 'profile_phone_number'
  | 'profile_room_accessibility_preference'
> & {
  profile_id: number | null
  profile_user_id: number | null
  profile_snail_mail_address: string | null
  profile_phone_number: string | null
  profile_room_accessibility_preference: string | null
}

const buildMembershipResults = (rows: Array<MembershipJoinRow>): Array<MembershipResult> => {
  const membershipsById = new Map<number, MembershipResult>()

  rows.forEach((row) => {
    let membership = membershipsById.get(row.id)

    if (!membership) {
      membership = {
        id: row.id,
        arrivalDate: row.arrivalDate,
        attendance: row.attendance,
        attending: row.attending,
        departureDate: row.departureDate,
        hotelRoomId: row.hotelRoomId,
        interestLevel: row.interestLevel,
        message: row.message,
        roomPreferenceAndNotes: row.roomPreferenceAndNotes,
        roomingPreferences: row.roomingPreferences,
        roomingWith: row.roomingWith,
        userId: row.userId,
        volunteer: row.volunteer,
        year: row.year,
        offerSubsidy: row.offerSubsidy,
        requestOldPrice: row.requestOldPrice,
        slotsAttending: row.slotsAttending,
        cost: row.cost,
        hotelRoom: {
          id: row.hotel_room_id,
          description: row.hotel_room_description,
          gamingRoom: row.hotel_room_gaming_room,
          occupancy: row.hotel_room_occupancy,
          quantity: row.hotel_room_quantity,
          rate: row.hotel_room_rate,
          bathroomType: row.hotel_room_bathroom_type,
          type: row.hotel_room_type,
        },
        user: {
          id: row.user_id,
          email: row.user_email,
          fullName: row.user_full_name,
          firstName: row.user_first_name,
          lastName: row.user_last_name,
          displayName: row.user_display_name,
          balance: row.user_balance,
          profile: [],
        },
      }

      membershipsById.set(membership.id, membership)
    }

    if (row.profile_id !== null && !membership.user.profile.some((profile) => profile.id === row.profile_id)) {
      membership.user.profile.push({
        id: row.profile_id,
        userId: row.profile_user_id ?? row.user_id,
        snailMailAddress: row.profile_snail_mail_address,
        phoneNumber: row.profile_phone_number,
        roomAccessibilityPreference:
          row.profile_room_accessibility_preference as MembershipProfileResult['roomAccessibilityPreference'],
      })
    }
  })

  return [...membershipsById.values()]
}

export const getMembershipByYearAndId = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetMembershipByYearAndIdInput
}) =>
  buildMembershipResults(
    (await tx.$queryRawTyped(
      membershipSql.getMembershipByYearAndId(input.year, input.userId),
    )) as Array<MembershipJoinRow>,
  )

export const getMembershipsByYear = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetMembershipsByYearInput
}) =>
  buildMembershipResults(
    (await tx.$queryRawTyped(membershipSql.getMembershipsByYear(input.year))) as Array<MembershipJoinRow>,
  )

export const getMembershipsById = async ({ tx, input }: { tx: TransactionClient; input: GetMembershipsByIdInput }) =>
  buildMembershipResults(
    (await tx.$queryRawTyped(membershipSql.getMembershipsById(input.id))) as Array<MembershipJoinRow>,
  )

export const getMembershipByYearAndRoom = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetMembershipByYearAndRoomInput
}) =>
  buildMembershipResults(
    (await tx.$queryRawTyped(
      membershipSql.getMembershipByYearAndRoom(input.year, input.hotelRoomId),
    )) as Array<MembershipJoinRow>,
  )

export const getAllMembersBy = ({ tx, input }: { tx: TransactionClient; input: GetAllMembersByInput }) =>
  tx.user
    .findMany({
      where: {
        fullName: {
          contains: input.query,
          mode: 'insensitive',
        },
      },
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        displayName: true,
        balance: true,
      },
    })
    .then(async (users) => {
      const userIds = users.map((user) => user.id)
      const profiles = await tx.profile.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      })
      const memberships = await tx.membership.findMany({
        where: {
          attending: true,
          year: input.year,
          userId: {
            in: userIds,
          },
        },
        select: {
          id: true,
          arrivalDate: true,
          attendance: true,
          attending: true,
          departureDate: true,
          hotelRoomId: true,
          interestLevel: true,
          message: true,
          roomPreferenceAndNotes: true,
          roomingPreferences: true,
          roomingWith: true,
          userId: true,
          volunteer: true,
          year: true,
          offerSubsidy: true,
          requestOldPrice: true,
          slotsAttending: true,
          cost: true,
        },
      })
      const profilesByUserId = new Map<number, Array<(typeof profiles)[number]>>()
      profiles.forEach((profile) => {
        const existingProfiles = profilesByUserId.get(profile.userId)
        if (existingProfiles) {
          existingProfiles.push(profile)
          return
        }

        profilesByUserId.set(profile.userId, [profile])
      })
      const usersWithProfiles = users.map((user) => ({
        ...user,
        profile: profilesByUserId.get(user.id) ?? [],
      }))
      const usersById = new Map(usersWithProfiles.map((user) => [user.id, user]))
      const membershipsByUserId = new Map<number, Array<(typeof memberships)[number]>>()
      memberships.forEach((membership) => {
        const existingMemberships = membershipsByUserId.get(membership.userId)
        if (existingMemberships) {
          existingMemberships.push(membership)
          return
        }

        membershipsByUserId.set(membership.userId, [membership])
      })

      return usersWithProfiles.map((user) => ({
        ...user,
        membership: (membershipsByUserId.get(user.id) ?? []).map((membership) => ({
          ...membership,
          user: usersById.get(membership.userId)!,
        })),
      }))
    })
