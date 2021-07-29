import { Button, FormControlLabel, Checkbox as MuiCheckbox, Switch, makeStyles } from '@material-ui/core'
import { useGetMembershipByYearAndIdQuery } from 'client'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { Route, Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
import {
  configuration,
  getSlotDescription,
  isNotPacificTime,
  range,
  useForceLogin,
  useUser,
  useYearFilter,
} from 'utils'

import { Field, MultiLine } from '../../components/CardUtils'
import { GraphQLError } from '../../components/GraphQLError'
import { GridContainer, GridItem } from '../../components/Grid'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { useProfile } from '../../components/Profile'
import { BecomeAMember } from './BecomeAMember'
import { MembershipDialog } from './MembershipDialog'
import { fromSlotsAttending } from './membershipUtils'

const useStyles = makeStyles({
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
})

const MembershipSummary: React.FC = () => {
  const forceLogin = useForceLogin()
  const profile = useProfile()
  const { userId } = useUser()
  const [year] = useYearFilter()
  const { isLoading, error, data } = useGetMembershipByYearAndIdQuery({ year, userId: userId ?? 0 })
  const classes = useStyles()
  const [showPT, setShowPT] = useState(false)
  const match = useRouteMatch()
  const history = useHistory()

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

  const slotsAttendingData = fromSlotsAttending(membership)

  return (
    <Page title='Membership Summary'>
      <Route
        path={`${match.url}/edit`}
        render={() => <MembershipDialog open onClose={onCloseEdit} initialValues={membership} profile={profile!} />}
      />
      <h1>Your Membership for {configuration.year}</h1>
      <br />
      <GridContainer>
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
        )}
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
