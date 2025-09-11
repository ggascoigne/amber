import React, { useMemo, useState } from 'react'

import {
  TransportError,
  RoomPref,
  getInterestLevel,
  getRoomPref,
  getSlotDescription,
  isNotPacificTime,
  useConfiguration,
  useGetCost,
  useProfile,
  useUser,
  useYearFilter,
} from '@amber/amber'
import { fromSlotsAttending } from '@amber/amber/utils/membershipUtils'
import { CreateMembershipType, UserAndProfile, useTRPC } from '@amber/client'
import {
  Card,
  CardBody,
  Field,
  GridContainer,
  GridItem,
  HeaderContent,
  Loader,
  MultiLine,
  Page,
  notEmpty,
  range,
} from '@amber/ui'
import { Box, Button, Checkbox as MuiCheckbox, FormControlLabel, Switch } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { BecomeAMember } from './BecomeAMember'
import { MembershipWizard } from './MembershipWizard'

interface VirtualDetailsProps {
  membership: CreateMembershipType
}

const VirtualDetails = ({ membership }: VirtualDetailsProps) => {
  const configuration = useConfiguration()
  const [showPT, setShowPT] = useState(false)
  const slotsAttendingData = fromSlotsAttending(configuration, membership)
  return (
    <GridContainer direction='column'>
      <h1>Your Membership for {configuration.year}</h1>
      <GridContainer>
        <Field label='Slots you intend to play'>
          <Box sx={{ position: 'relative', pt: 0, display: 'flex', flexDirection: 'column' }}>
            {isNotPacificTime(configuration) && (
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showPT}
                      onChange={() => setShowPT((old) => !old)}
                      name='showLocal'
                      color='primary'
                    />
                  }
                  label='Show slot times in Pacific time'
                />
              </div>
            )}
            {range(configuration.numberOfSlots).map((i) => (
              <FormControlLabel
                key={i}
                name={`slotsAttendingData[${i}]`}
                control={<MuiCheckbox {...{ disabled: true, checked: slotsAttendingData[i] }} />}
                {...{
                  label: getSlotDescription(configuration, {
                    year: configuration.year,
                    slot: i + 1,
                    local: !showPT,
                  }),
                }}
              />
            ))}
          </Box>
        </Field>
        {membership.message && (
          <Field label='Message'>
            <MultiLine text={membership.message} />
          </Field>
        )}{' '}
      </GridContainer>
    </GridContainer>
  )
}

const formatDate = (date?: string | Date) => {
  if (date === undefined) {
    return ''
  }
  const dateTime = date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
  return dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
}

const VerticalGap = () => (
  <GridItem size={{ xs: 12 }}>
    <Box sx={{ height: 8 }} />
  </GridItem>
)

interface DetailsProps {
  membership: CreateMembershipType
  profile: UserAndProfile
}

const Details = ({ membership, profile }: DetailsProps) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const { isLoading, error, data } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())
  const [year] = useYearFilter()
  const cost = useGetCost(membership)

  const room = useMemo(
    () => data?.filter(notEmpty).find((r) => r.id === membership.hotelRoomId),
    [data, membership.hotelRoomId],
  )

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  return (
    <Card>
      <HeaderContent name={`${year} Membership for ${profile.fullName!}`} />
      <CardBody>
        <GridContainer>
          <Field label='Email'>{profile.email}</Field>
          <VerticalGap />
          <Field label='Attendance'>{cost}</Field>
          <Field label='Payment'>{getInterestLevel(configuration, membership.interestLevel)}</Field>
          {membership.offerSubsidy && (
            <Field label=''>You have offered to contribute to the ACNW assistance fund, thank you.</Field>
          )}
          {membership.requestOldPrice && <Field label=''>You are receiving a subsidized membership rate.</Field>}
          <Field label='Arrival Date'>{formatDate(membership.arrivalDate)}</Field>
          <Field label='Departure Date'>{formatDate(membership.departureDate)}</Field>
          <VerticalGap />
          <Field label='Hotel room'>{room?.description}</Field>
          <Field label='Room Preference And Notes'>{membership.roomPreferenceAndNotes}</Field>
          <Field label='Rooming Preferences'>{getRoomPref(membership.roomingPreferences)}</Field>
          {membership.roomingPreferences === RoomPref.RoomWith && (
            <Field label='Rooming with'>{membership.roomingWith}</Field>
          )}
          <VerticalGap />
          <Field label='Postal Address'>{profile?.profile?.[0]?.snailMailAddress}</Field>
          <Field label='Phone Number'>{profile?.profile?.[0]?.phoneNumber}</Field>
          <VerticalGap />
          <Field label='Any other Message'>{membership.message}</Field>
        </GridContainer>
      </CardBody>
    </Card>
  )
}

const MembershipSummary = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const profile = useProfile()
  const { userId } = useUser()
  const [year] = useYearFilter()
  const { isLoading, error, data } = useQuery(
    trpc.memberships.getMembershipByYearAndId.queryOptions({ year, userId: userId ?? 0 }),
  )
  const isVirtual = configuration.startDates[year].virtual
  const router = useRouter()
  const { query } = router

  const onCloseMembershipDialog = () => {
    router.push('/membership')
  }

  if (error) {
    return <TransportError error={error} />
  }

  if (isLoading || !data) {
    return <Loader />
  }
  const displayNew = query.all?.[0] === 'new'
  const membership = data?.[0]

  if (!membership || displayNew) {
    return (
      <Page title='Become a Member'>
        {displayNew && <MembershipWizard open onClose={onCloseMembershipDialog} profile={profile!} />}
        <BecomeAMember />
      </Page>
    )
  }

  const displayEdit = query.all?.[0] === 'edit'

  return (
    <Page title='Membership Summary'>
      {displayEdit && (
        <MembershipWizard open onClose={onCloseMembershipDialog} initialValues={membership} profile={profile!} />
      )}

      <br />
      {isVirtual ? <VirtualDetails membership={membership} /> : <Details membership={membership} profile={profile!} />}
      <GridContainer>
        <GridItem size={{ xs: 12, sm: 5 }} sx={{ pb: '10px' }}>
          <Button component={Link} href='/membership/edit' variant='outlined' disabled={!profile}>
            Edit
          </Button>
        </GridItem>
      </GridContainer>
    </Page>
  )
}

export default MembershipSummary
