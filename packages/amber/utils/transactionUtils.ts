import { useMemo } from 'react'

import { GqlType, OnCloseHandler, pick, ToFormValues, useNotification } from 'ui'
import {} from 'yup'

import type { MembershipType } from './apiTypes'
import { Configuration, useConfiguration } from './configContext'
import { Attendance } from './selectValues'
import { useUser } from './useUserFilterState'
import { useYearFilter } from './useYearFilterState'

import {
  GetTransactionByUserQuery,
  GetTransactionQuery,
  useGraphQLMutation,
  CreateTransactionDocument,
  UpdateTransactionByNodeIdDocument,
} from '../client-graphql'
import { useInvalidatePaymentQueries } from '../client-graphql/querySets'

export type TransactionValue = ToFormValues<GqlType<GetTransactionQuery, ['transactions', 'nodes', number]>>

export const getMembershipCost = (configuration: Configuration, values: MembershipType): number => {
  if (configuration.virtual) {
    return parseInt(configuration.virtualCost, 10) || 0
  }
  if (configuration.useUsAttendanceOptions) {
    const acusPrices: Record<string, number> = {
      '1': 25,
      '2': 40,
      '3': 55,
      '4': 70,
    }
    return acusPrices[values.attendance] ?? 0
  } else {
    if (values.attendance === Attendance.ThursSun) {
      return values.requestOldPrice ? configuration.subsidizedMembership : configuration.fourDayMembership
    }
    return values.requestOldPrice ? configuration.subsidizedMembershipShort : configuration.threeDayMembership
  }
}

export const getMembershipString = (configuration: Configuration, values: MembershipType): string => {
  if (configuration.virtual) {
    return 'Virtual Membership'
  }
  if (configuration.useUsAttendanceOptions) {
    const days: Record<string, string> = {
      '1': 'One',
      '2': 'Two',
      '3': 'Three',
      '4': 'Four',
    }
    return days[values.attendance]
      ? `${days[values.attendance]} Day Membership`
      : `${values.attendance} Days Membership`
  }
  if (values.attendance === Attendance.ThursSun) {
    return values.requestOldPrice ? 'Subsidized Four Day Membership' : 'Four Day Membership'
  }
  return values.requestOldPrice ? 'Subsidized Three Day Membership' : 'Three Day Membership'
}

export const useEditTransaction = (onClose?: OnCloseHandler) => {
  const createTransaction = useGraphQLMutation(CreateTransactionDocument)
  const updateTransaction = useGraphQLMutation(UpdateTransactionByNodeIdDocument)
  const invalidatePaymentQueries = useInvalidatePaymentQueries()
  const { userId } = useUser()
  const [year] = useYearFilter()

  const notify = useNotification()

  return async (transactionValues: TransactionValue) => {
    if (transactionValues?.nodeId) {
      const values = pick(transactionValues, 'amount', 'notes')

      await updateTransaction
        .mutateAsync(
          {
            input: {
              nodeId: transactionValues.nodeId as string,
              patch: {
                ...values,
                origin: userId,
                year,
              },
            },
          },
          {
            onSuccess: invalidatePaymentQueries,
          },
        )
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      const values = pick(transactionValues, 'amount', 'notes')
      await createTransaction
        .mutateAsync(
          {
            input: {
              transaction: {
                userId: userId!,
                // memberId should only be set for a membership cost
                // associating a membership with its cost
                // it is only set when the transaction record is created for a new membership
                // memberId: membership?.id,
                origin: userId,
                stripe: false,
                year,
                ...values,
                data: {},
              },
            },
          },
          {
            onSuccess: invalidatePaymentQueries,
          },
        )
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
    onClose?.()
  }
}

export const useTransactionValues = (values: TransactionValue | null | undefined): TransactionValue => {
  const { userId } = useUser()
  const [year] = useYearFilter()

  return useMemo(
    () => ({
      timestamp: Date.now().toLocaleString(),
      ...values,
      userId: values?.userId ?? userId!,
      amount: values?.amount ?? 0,
      origin: values?.origin ?? userId,
      stripe: values?.stripe ?? false,
      year: values?.year ?? year,
      notes: values?.notes ?? '',
      data: {},
    }),
    [userId, values, year],
  )
}

export const useEditMembershipTransaction = (onClose: OnCloseHandler) => {
  const configuration = useConfiguration()
  const invalidatePaymentQueries = useInvalidatePaymentQueries()
  const createTransaction = useGraphQLMutation(CreateTransactionDocument)
  const updateTransaction = useGraphQLMutation(UpdateTransactionByNodeIdDocument)
  const notify = useNotification()
  const { userId } = useUser()

  return async (membershipValues: MembershipType, membershipId: number, transactions?: GetTransactionByUserQuery) => {
    const membershipTransactionNodeId = transactions?.transactions?.nodes.find(
      (t) => t?.memberId === membershipId && t?.stripe === false,
    )?.nodeId

    if (membershipTransactionNodeId) {
      await updateTransaction
        .mutateAsync(
          {
            input: {
              nodeId: membershipTransactionNodeId,
              patch: {
                amount: 0 - getMembershipCost(configuration, membershipValues),
                memberId: membershipId,
                year: membershipValues.year,
                notes: getMembershipString(configuration, membershipValues),
                origin: userId,
                stripe: false,
                userId: membershipValues.userId,
              },
            },
          },
          {
            onSuccess: invalidatePaymentQueries,
          },
        )
        .then(() => {
          onClose()
        })
        .catch((error: any) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createTransaction
        .mutateAsync(
          {
            input: {
              transaction: {
                amount: 0 - getMembershipCost(configuration, membershipValues),
                memberId: membershipId,
                year: membershipValues.year,
                notes: getMembershipString(configuration, membershipValues),
                origin: userId,
                stripe: false,
                userId: membershipValues.userId,
                data: {},
              },
            },
          },
          {
            onSuccess: invalidatePaymentQueries,
          },
        )
        .then(() => {
          onClose()
        })
        .catch((error: any) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}
