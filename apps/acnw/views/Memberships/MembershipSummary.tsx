import React, { useMemo, useState } from 'react'

import { Button, Checkbox as MuiCheckbox, FormControlLabel, Switch } from '@mui/material'
import {
  ProfileFormType,
  RoomPref,
  getInterestLevel,
  getRoomPref,
  getSlotDescription,
  isNotPacificTime,
  useConfiguration,
  useGetCost,
  useGetHotelRoomsQuery,
  useGetMembershipByYearAndIdQuery,
  useProfile,
  useUser,
  useYearFilter,
} from 'amber'
import { MembershipType } from 'amber/utils/apiTypes'
import { fromSlotsAttending } from 'amber/utils/membershipUtils'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { makeStyles } from 'tss-react/mui'
import {
  Card,
  CardBody,
  Field,
  GraphQLError,
  GridContainer,
  GridItem,
  HeaderContent,
  Loader,
  MultiLine,
  Page,
  notEmpty,
  range,
} from 'ui'

import { BecomeAMember } from './BecomeAMember'
import { MembershipWizard } from './MembershipWizard'

const useStyles = makeStyles()({
  card: {
    marginBottom: 50,
  },
  gridItem: {
    paddingBottom: 10,
  },
  slotSelection: {
    position: 'relative',
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  vspace: {
    height: 8,
  },
})

interface VirtualDetailsProps {
  membership: MembershipType
}

const VirtualDetails: React.FC<VirtualDetailsProps> = ({ membership }) => {
  const configuration = useConfiguration()
  const [showPT, setShowPT] = useState(false)
  const slotsAttendingData = fromSlotsAttending(configuration, membership)
  const { classes } = useStyles()
  return (
    <GridContainer direction='column'>
      <h1>Your Membership for {configuration.year}</h1>
      <GridContainer item>
        <Field label='Slots you intend to play'>
          <div className={classes.slotSelection}>
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
          </div>
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

const formatDate = (date?: string) =>
  date ? DateTime.fromISO(date)?.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : ''

const VerticalGap = () => {
  const { classes } = useStyles()
  return (
    <GridItem xs={12}>
      <br className={classes.vspace} />
    </GridItem>
  )
}

interface DetailsProps {
  membership: MembershipType
  profile: ProfileFormType
}

const Details: React.FC<DetailsProps> = ({ membership, profile }) => {
  const configuration = useConfiguration()
  const { isLoading, error, data } = useGetHotelRoomsQuery()
  const [year] = useYearFilter()
  const cost = useGetCost(membership)

  const room = useMemo(
    () =>
      data
        ?.hotelRooms!.edges.map((v) => v.node)
        .filter(notEmpty)
        .find((r) => r.id === membership.hotelRoomId),
    [data, membership.hotelRoomId]
  )

  if (error) {
    return <GraphQLError error={error} />
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
          {membership.requestOldPrice && <Field label=''>You have requested the subsidized membership rate.</Field>}
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
          <Field label='Postal Address'>{profile?.profiles?.nodes?.[0]?.snailMailAddress}</Field>
          <Field label='Phone Number'>{profile?.profiles?.nodes?.[0]?.phoneNumber}</Field>
          <VerticalGap />
          <Field label='Any other Message'>{membership.message}</Field>
        </GridContainer>
      </CardBody>
    </Card>
  )
}

const MembershipSummary: React.FC = () => {
  const configuration = useConfiguration()
  const profile = useProfile()
  const { userId } = useUser()
  const [year] = useYearFilter()
  const { isLoading, error, data } = useGetMembershipByYearAndIdQuery({ year, userId: userId ?? 0 })
  const { classes } = useStyles()
  const isVirtual = configuration.startDates[year].virtual
  const router = useRouter()
  const { query } = router

  const onCloseMembershipDialog = () => {
    router.push('/membership')
  }

  if (error) {
    return <GraphQLError error={error} />
  }

  if (isLoading || !data) {
    return <Loader />
  }
  const displayNew = query.all?.[0] === 'new'
  const membership = data.memberships?.nodes[0]

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
        <GridItem xs={12} sm={5} className={classes.gridItem}>
          <Button component={Link} href='/membership/edit' variant='outlined' disabled={!profile}>
            Edit
          </Button>
        </GridItem>
      </GridContainer>
    </Page>
  )
}

export default MembershipSummary
