import { Button, FormControlLabel, Checkbox as MuiCheckbox, Switch } from '@mui/material'
import { useGetHotelRoomsQuery, useGetMembershipByYearAndIdQuery } from 'client'
import { DateTime } from 'luxon'
import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { Route, Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import {
  RoomPref,
  configuration,
  getAttendance,
  getInterestLevel,
  getRoomPref,
  getSlotDescription,
  isNotPacificTime,
  notEmpty,
  range,
  useForceLogin,
  useUser,
  useYearFilter,
} from 'utils'

import { Card, CardBody } from '../../components/Card'
import { Field, HeaderContent, MultiLine } from '../../components/CardUtils'
import { GraphQLError } from '../../components/GraphQLError'
import { GridContainer, GridItem } from '../../components/Grid'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { ProfileFormType, useProfile } from '../../components/Profile'
import { BecomeAMember } from './BecomeAMember'
import { MembershipType, fromSlotsAttending } from './membershipUtils'
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
  const [showPT, setShowPT] = useState(false)
  const slotsAttendingData = fromSlotsAttending(membership)
  const { classes } = useStyles()
  return (
    <GridContainer direction='column'>
      <h1>Your Membership for {configuration.year}</h1>
      <GridContainer item>
        <Field label='Slots you intend to play'>
          <div className={classes.slotSelection}>
            {isNotPacificTime() && (
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
            {range(7).map((i) => (
              <FormControlLabel
                key={i}
                name={`slotsAttendingData[${i}]`}
                control={<MuiCheckbox {...{ disabled: true, checked: slotsAttendingData[i] }} />}
                {...{
                  label: getSlotDescription({
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
  const { isLoading, error, data } = useGetHotelRoomsQuery()
  const [year] = useYearFilter()

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
          <Field label='Attendance'>{getAttendance(membership.attendance)}</Field>
          <Field label='Payment'>{getInterestLevel(membership.interestLevel)}</Field>
          {membership.offerSubsidy && <Field label='You have offered to provide assistance'>Thank you</Field>}
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
  const forceLogin = useForceLogin()
  const profile = useProfile()
  const { userId } = useUser()
  const [year] = useYearFilter()
  const { isLoading, error, data } = useGetMembershipByYearAndIdQuery({ year, userId: userId ?? 0 })
  const { classes } = useStyles()
  const match = useRouteMatch()
  const history = useHistory()
  const isVirtual = configuration.startDates[year].virtual

  useEffect(() => {
    const f = async () => await forceLogin({ appState: { targetUrl: '/membership' } })
    f().then()
  }, [forceLogin])

  if (error) {
    return <GraphQLError error={error} />
  }

  if (isLoading || !data) {
    return <Loader />
  }
  const membership = data.memberships?.nodes[0]
  if (!membership) {
    return (
      <Page title='Become a Member'>
        <BecomeAMember />
      </Page>
    )
  }

  const onCloseEdit: MouseEventHandler = () => {
    history.push(match.url)
  }

  return (
    <Page title='Membership Summary'>
      <Route
        path={`${match.url}/edit`}
        render={() => <MembershipWizard open onClose={onCloseEdit} initialValues={membership} profile={profile!} />}
      />
      <br />
      {isVirtual ? <VirtualDetails membership={membership} /> : <Details membership={membership} profile={profile!} />}
      <GridContainer>
        <GridItem xs={12} sm={5} className={classes.gridItem}>
          <Button component={RouterLink} to={`${match.url}/edit`} variant='outlined' disabled={!profile}>
            Edit
          </Button>
        </GridItem>
      </GridContainer>
    </Page>
  )
}

export default MembershipSummary
