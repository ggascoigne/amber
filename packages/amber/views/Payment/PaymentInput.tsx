import * as React from 'react'
import { useReducer, useEffect, useState, useCallback } from 'react'

import { CreateMembershipType, User, UserMembership, useTRPC } from '@amber/client'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { DialogClose, getSafeFloat, Loader } from 'ui'

import { MemberSelector } from '../../components'
import { OutlinedBox } from '../../components/OutlinedBox'
import {
  Configuration,
  deleteArrayEntry,
  formatAmountForDisplay,
  InterestLevel,
  updateArray,
  useConfiguration,
  useYearFilter,
} from '../../utils'
import { getMembershipCost, getMembershipString } from '../../utils/transactionUtils'

// keep in sync with ./packages/api/src/stripe/types.ts
export type UserPaymentDetails = {
  userId: number
  memberId: number | null
  total: number
  membership: number
  donation: number
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

const calculateState = (state: ReducerState) => {
  const result = {
    ...state,
    membershipPayment: match(state.buttonState)
      .with('deposit', () => state.deposit)
      .with('full', () => state.balance)
      .with('other', () => state.customValue)
      .exhaustive(),
  }
  // console.log('calculateState', result)
  return result
}

const reducer = (state: ReducerState, action: ReducerAction) => {
  // console.log('reducer state', state)

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

type MemberOrUserPaymentProps = {
  loggedInUserId: number
  membership: CreateMembershipType | undefined
  year: number
  balance: number
  user: User
  onChange: (info: UserPaymentDetails) => void
  onRemoveUserPayment: (userId: number) => void
}

const canDoFullMembershipPayment = (
  membership: CreateMembershipType | undefined,
  balance: number,
  configuration: Configuration,
) => (membership ? balance === getMembershipCost(configuration, membership) : false)

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

const MemberOrUserPayment: React.FC<MemberOrUserPaymentProps> = ({
  membership,
  user,
  year,
  balance,
  onChange,
  loggedInUserId,
  onRemoveUserPayment,
}) => {
  const configuration = useConfiguration()
  const displayFullMembershipPayment = canDoFullMembershipPayment(membership, balance, configuration)

  const [state, dispatch] = useReducer(
    reducer,
    {
      deposit: configuration.deposit,
      balance,
      buttonState: defaultButtonState(membership, balance, displayFullMembershipPayment),
      donation: membership ? (loggedInUserId === user.id && membership.offerSubsidy ? 70 : 0) : 0,
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
  }, [balance, configuration, displayFullMembershipPayment, membership, year])

  useEffect(() => {
    onChange({
      userId: user.id,
      memberId: membership?.id ?? null,
      total: state.membershipPayment + state.donation,
      membership: state.membershipPayment,
      donation: state.donation,
    })
  }, [membership?.id, onChange, state, user.id])

  const handleMembershipPaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'setButtonState', value: (event.target as HTMLInputElement).value as ButtonState })
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
        <Grid container spacing={2} sx={{ py: 1 }} flexDirection='column'>
          <Grid item>
            <Typography sx={{ pt: 1 }}>
              {user.fullName} has a balance of {user.balance < 0 ? formatAmountForDisplay(0 - user.balance) : 0}
            </Typography>
          </Grid>
          <Grid item container flexDirection='row'>
            <Grid item>
              <RadioGroup
                row
                aria-labelledby='membership-group-label'
                name='membership-buttons-group'
                value={state.buttonState}
                onChange={handleMembershipPaymentChange}
              >
                {displayFullMembershipPayment && (
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
                )}
                <FormControlLabel
                  value='other'
                  control={<Radio />}
                  label={displayFullMembershipPayment ? 'Partial Payment' : 'Payment'}
                />
              </RadioGroup>
            </Grid>
            <Grid item>
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
        {loggedInUserId === user.id && (
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
              InputProps={{
                startAdornment: <InputAdornment position='start'>$</InputAdornment>,
              }}
            />
          </>
        )}
      </FormControl>
    </OutlinedBox>
  )
}

type UserPaymentProps = {
  year: number
  userId: number
  loggedInUserId: number
  handlePaymentChange: (info: UserPaymentDetails) => void
  onRemoveUserPayment: (userId: number) => void
}

const UserPayment: React.FC<UserPaymentProps> = ({
  year,
  userId,
  handlePaymentChange,
  loggedInUserId,
  onRemoveUserPayment,
}) => {
  const trpc = useTRPC()
  const { data: user } = useQuery(trpc.users.getUser.queryOptions({ id: userId }))
  const { data: membership } = useQuery(
    trpc.memberships.getMembershipByYearAndId.queryOptions({
      year,
      userId,
    }),
  )

  const balance = (user?.balance ?? 0) > 0 ? 0 - user!.balance : 0

  if (!user) return <Loader />

  return (
    <MemberOrUserPayment
      balance={balance}
      membership={membership?.[0]}
      year={year}
      user={user}
      loggedInUserId={loggedInUserId}
      onChange={handlePaymentChange}
      onRemoveUserPayment={onRemoveUserPayment}
    />
  )
}

type PaymentInputProps = {
  userId: number
  name: string
  setPayments: React.Dispatch<React.SetStateAction<UserPaymentDetails[]>>
}

export const PaymentInput: React.FC<PaymentInputProps> = ({ userId, setPayments }) => {
  const [year] = useYearFilter()
  const [userIds, setUserIds] = useState([userId])

  const handlePaymentChange = useCallback(
    (info: UserPaymentDetails) => {
      setPayments((old) => updateArray(old, 'userId', info))
    },
    [setPayments],
  )

  const onAddAnotherMember = useCallback((newValue: UserMembership | null) => {
    if (newValue) {
      setUserIds((ids) => Array.from(new Set(ids).add(newValue?.id)))
    }
  }, [])

  const onRemoveUserPayment = useCallback(
    (id: number) => {
      setPayments((old) => deleteArrayEntry(old, 'userId', id))
      setUserIds((ids) => {
        const vals = new Set(ids)
        vals.delete(id)
        return Array.from(vals)
      })
    },
    [setPayments],
  )

  return (
    <Box sx={{ width: '100%', pb: 2 }}>
      <Typography id='input-slider' gutterBottom>
        Payment
      </Typography>
      <Grid container spacing={2} alignItems='flex-start' flexDirection='column'>
        {userIds.map((id) => (
          <Grid item xs sx={{ width: '100%' }} key={id}>
            <UserPayment
              loggedInUserId={userId}
              userId={id}
              year={year}
              handlePaymentChange={handlePaymentChange}
              onRemoveUserPayment={onRemoveUserPayment}
            />
          </Grid>
        ))}
        <Grid item xs sx={{ width: '100%' }}>
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
