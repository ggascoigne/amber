import type * as React from 'react'
import { useCallback, useEffect, useReducer, useState } from 'react'

import type { CreateMembershipType, User, UserMembership } from '@amber/client'
import { useTRPC } from '@amber/client'
import { DialogClose, getSafeFloat, Loader } from '@amber/ui'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'

import { MemberSelector } from '../../components'
import { OutlinedBox } from '../../components/OutlinedBox'
import { deleteArrayEntry, updateArray } from '../../utils/array'
import type { Configuration } from '../../utils/configContext'
import { useConfiguration } from '../../utils/configContext'
import { InterestLevel } from '../../utils/selectValues'
import { getMembershipString, getMembershipTotal } from '../../utils/transactionUtils'
import { formatAmountForDisplay } from '../../utils/useStripe'
import { useYearFilter } from '../../utils/useYearFilterState'

export type UserPaymentDetails = {
  userId: number
  memberId: number | null
  total: number
  membership: number
  donation: number
  donationSource?: 'payment' | 'membership' | 'none'
}

export type PaymentInputOptions = {
  hideDonationForOwnMembership?: boolean
}

type ButtonState = 'deposit' | 'full' | 'other'

type ReducerActionKind = 'setButtonState' | 'setDonation' | 'setCustomValue'

type ReducerState = {
  deposit: number
  balance: number
  buttonState: ButtonState
  donation: number
  customValue: number
  membershipPayment: number
}

type ReducerAction = {
  type: ReducerActionKind
  value: any
}

type MemberOrUserPaymentProps = {
  loggedInUserId: number
  membership: CreateMembershipType | undefined
  year: number
  balance: number
  user: User
  onChange: (info: UserPaymentDetails) => void
  onRemoveUserPayment: (userId: number) => void
  hideDonationForOwnMembership: boolean
}

type UserPaymentProps = {
  year: number
  userId: number
  loggedInUserId: number
  handlePaymentChange: (info: UserPaymentDetails) => void
  onRemoveUserPayment: (userId: number) => void
  hideDonationForOwnMembership: boolean
}

type PaymentInputProps = {
  userId: number
  name: string
  setPayments: React.Dispatch<React.SetStateAction<UserPaymentDetails[]>>
  options?: PaymentInputOptions
}

const calculateState = (state: ReducerState) => ({
  ...state,
  membershipPayment: match(state.buttonState)
    .with('deposit', () => state.deposit)
    .with('full', () => state.balance)
    .with('other', () => state.customValue)
    .exhaustive(),
})

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case 'setButtonState': {
      return calculateState({
        ...state,
        buttonState: action.value,
      })
    }
    case 'setDonation': {
      return calculateState({
        ...state,
        donation: action.value,
      })
    }
    case 'setCustomValue': {
      return calculateState({
        ...state,
        customValue: action.value,
      })
    }
    default:
      return state
  }
}

const getSafeEventFloat = (event: React.ChangeEvent<HTMLInputElement>) =>
  getSafeFloat((event.target as HTMLInputElement).value)

const canDoFullMembershipPayment = (
  membership: CreateMembershipType | undefined,
  balance: number,
  configuration: Configuration,
) => (membership ? balance === getMembershipTotal(configuration, membership) : false)

const defaultButtonState = (
  membership: CreateMembershipType | undefined,
  balance: number,
  displayFullMembershipPayment: boolean,
) =>
  !membership || !displayFullMembershipPayment
    ? 'other'
    : membership.interestLevel === InterestLevel.Deposit
      ? 'deposit'
      : balance > 0
        ? 'full'
        : 'other'

const shouldShowDonationField = ({
  hideDonationForOwnMembership,
  loggedInUserId,
  membership,
  user,
}: Pick<MemberOrUserPaymentProps, 'hideDonationForOwnMembership' | 'loggedInUserId' | 'membership' | 'user'>) => {
  if (loggedInUserId !== user.id) {
    return false
  }

  if (!hideDonationForOwnMembership) {
    return true
  }

  return membership?.offerSubsidy === true && (membership.donation ?? 0) === 0
}

const MemberOrUserPayment = ({
  membership,
  user,
  year,
  balance,
  onChange,
  loggedInUserId,
  onRemoveUserPayment,
  hideDonationForOwnMembership,
}: MemberOrUserPaymentProps) => {
  const configuration = useConfiguration()
  const displayFullMembershipPayment = canDoFullMembershipPayment(membership, balance, configuration)
  const showDonationField = shouldShowDonationField({
    hideDonationForOwnMembership,
    loggedInUserId,
    membership,
    user,
  })

  const [state, dispatch] = useReducer(
    reducer,
    {
      deposit: configuration.deposit,
      balance,
      buttonState: defaultButtonState(membership, balance, displayFullMembershipPayment),
      donation: showDonationField ? (membership && membership.offerSubsidy ? 80 : 0) : 0,
      customValue: Math.max(membership && displayFullMembershipPayment ? 0 : 0 - user.balance, 0),
      membershipPayment: 0,
    },
    calculateState,
  )

  useEffect(() => {
    dispatch({
      type: 'setButtonState',
      value: defaultButtonState(membership, balance, displayFullMembershipPayment),
    })
  }, [balance, displayFullMembershipPayment, membership])

  useEffect(() => {
    if (!showDonationField && state.donation !== 0) {
      dispatch({ type: 'setDonation', value: 0 })
    }
  }, [showDonationField, state.donation])

  useEffect(() => {
    onChange({
      userId: user.id,
      memberId: membership?.id ?? null,
      total: state.membershipPayment + state.donation,
      membership: state.membershipPayment,
      donation: state.donation,
      donationSource: showDonationField ? 'payment' : 'none',
    })
  }, [membership?.id, onChange, showDonationField, state, user.id])

  const handleMembershipPaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'setButtonState',
      value: (event.target as HTMLInputElement).value as ButtonState,
    })
  }

  const handleDonationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setDonation', value: getSafeEventFloat(event) })
  }

  const handleCustomValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setCustomValue', value: getSafeEventFloat(event) })
  }

  const onClose = () => {
    onRemoveUserPayment(membership?.userId ?? user.id)
  }

  return (
    <OutlinedBox label={membership ? `${year} Membership for ${user.fullName}` : null}>
      <DialogClose onClose={onClose} />
      <FormControl>
        <Grid container spacing={2} sx={{ py: 1, flexDirection: 'column' }}>
          <Grid>
            <Typography sx={{ pt: 1 }}>
              {user.fullName} has a balance of {user.balance < 0 ? formatAmountForDisplay(0 - user.balance) : 0}
            </Typography>
          </Grid>
          <Grid container>
            <Grid>
              <RadioGroup
                row
                aria-labelledby='membership-group-label'
                name='membership-buttons-group'
                value={state.buttonState}
                onChange={handleMembershipPaymentChange}
              >
                {displayFullMembershipPayment ? (
                  <>
                    <FormControlLabel
                      value='full'
                      control={<Radio />}
                      label={
                        membership
                          ? `${getMembershipString(configuration, membership)}: ${formatAmountForDisplay(balance)}`
                          : null
                      }
                    />
                    <FormControlLabel
                      value='deposit'
                      control={<Radio />}
                      label={`Deposit: ${formatAmountForDisplay(configuration.deposit)}`}
                    />
                  </>
                ) : null}
                <FormControlLabel
                  value='other'
                  control={<Radio />}
                  label={displayFullMembershipPayment ? 'Partial Payment' : 'Payment'}
                />
              </RadioGroup>
            </Grid>
            <Grid>
              <TextField
                label={displayFullMembershipPayment ? 'Partial Payment' : 'Payment'}
                value={state.customValue}
                variant='outlined'
                onChange={handleCustomValueChange}
                disabled={state.buttonState !== 'other'}
              />
            </Grid>
          </Grid>
        </Grid>
        {showDonationField ? (
          <>
            <Typography sx={{ pb: 2 }}>
              If you would like to contribute to assist other members coming to the convention, please enter an amount
              here.
            </Typography>
            <TextField
              id='donation'
              label='Donation'
              variant='outlined'
              value={state.donation}
              onChange={handleDonationChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                },
              }}
            />
          </>
        ) : null}
      </FormControl>
    </OutlinedBox>
  )
}

const UserPayment = ({
  year,
  userId,
  handlePaymentChange,
  loggedInUserId,
  onRemoveUserPayment,
  hideDonationForOwnMembership,
}: UserPaymentProps) => {
  const trpc = useTRPC()
  const { data: user } = useQuery(trpc.users.getUser.queryOptions({ id: userId }))
  const { data: membership } = useQuery(
    trpc.memberships.getMembershipByYearAndId.queryOptions({
      year,
      userId,
    }),
  )

  const balance = (user?.balance ?? 0) > 0 ? 0 - user!.balance : 0

  if (!user) {
    return <Loader />
  }

  return (
    <MemberOrUserPayment
      balance={balance}
      membership={membership?.[0]}
      year={year}
      user={user}
      loggedInUserId={loggedInUserId}
      onChange={handlePaymentChange}
      onRemoveUserPayment={onRemoveUserPayment}
      hideDonationForOwnMembership={hideDonationForOwnMembership}
    />
  )
}

export const PaymentInput = ({ userId, setPayments, options }: PaymentInputProps) => {
  const [year] = useYearFilter()
  const [userIds, setUserIds] = useState([userId])
  const hideDonationForOwnMembership = options?.hideDonationForOwnMembership ?? false

  const handlePaymentChange = useCallback(
    (info: UserPaymentDetails) => {
      setPayments((old) => updateArray(old, 'userId', info))
    },
    [setPayments],
  )

  const onAddAnotherMember = useCallback((newValue: UserMembership | null) => {
    if (newValue) {
      setUserIds((ids) => Array.from(new Set(ids).add(newValue.id)))
    }
  }, [])

  const onRemoveUserPayment = useCallback(
    (id: number) => {
      setPayments((old) => deleteArrayEntry(old, 'userId', id))
      setUserIds((ids) => {
        const values = new Set(ids)
        values.delete(id)
        return Array.from(values)
      })
    },
    [setPayments],
  )

  return (
    <Box sx={{ width: '100%', pb: 2 }}>
      <Typography id='input-slider' gutterBottom>
        Payment
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'flex-start', flexDirection: 'column' }}>
        {userIds.map((id) => (
          <Grid sx={{ width: '100%' }} key={id} size='grow'>
            <UserPayment
              loggedInUserId={userId}
              userId={id}
              year={year}
              handlePaymentChange={handlePaymentChange}
              onRemoveUserPayment={onRemoveUserPayment}
              hideDonationForOwnMembership={hideDonationForOwnMembership}
            />
          </Grid>
        ))}
        <Grid sx={{ width: '100%' }} size='grow'>
          <MemberSelector
            year={year}
            label='Add Payment for another Registered Member'
            onChange={onAddAnotherMember}
            onlyDisplayMembersWithBalances
          />
        </Grid>
      </Grid>
    </Box>
  )
}
