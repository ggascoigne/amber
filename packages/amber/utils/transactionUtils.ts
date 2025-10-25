import { useMemo } from 'react'

import type { CreateMembershipType, Transaction, ToFormValues } from '@amber/client'
import { useTRPC, useInvalidatePaymentQueries } from '@amber/client'
import type { OnCloseHandler, Expand } from '@amber/ui'
import { pick, useNotification } from '@amber/ui'
import { useMutation } from '@tanstack/react-query'
import {} from 'yup'

import type { Configuration } from './configContext'
import { useConfiguration } from './configContext'
import { Attendance } from './selectValues'
import { useUser } from './useUserFilterState'
import { useYearFilter } from './useYearFilterState'

// export type GameDialogFormValues = Expand<
//   ToFormValues<Omit<Game, 'gameAssignment' | 'authorId' | 'room' | 'shortName'>>
// >

export type TransactionValue = Expand<ToFormValues<Transaction>>
export type TransactionFormValue = Expand<
  ToFormValues<Omit<Transaction, 'membership' | 'user' | 'user' | 'userByOrigin'>>
>

export const getMembershipCost = (configuration: Configuration, values: CreateMembershipType): number => {
  if (configuration.virtual) {
    return parseInt(configuration.virtualCost, 10) || 0
  }
  if (configuration.isAcus) {
    const acusPrices: Record<string, number> = {
      '1': 25,
      '2': 40,
      '3': 55,
      '4': 70,
    }
    return acusPrices[values.attendance] ?? 0
  } else {
    return values.cost ?? 0
  }
}

export const getMembershipString = (configuration: Configuration, values: CreateMembershipType): string => {
  if (configuration.virtual) {
    return 'Virtual Membership'
  }
  if (configuration.isAcus) {
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
  const trpc = useTRPC()
  const createTransaction = useMutation(trpc.transactions.createTransaction.mutationOptions())
  const updateTransaction = useMutation(trpc.transactions.updateTransaction.mutationOptions())
  const invalidatePaymentQueries = useInvalidatePaymentQueries()
  const { userId } = useUser()
  const [year] = useYearFilter()

  const notify = useNotification()

  return async (transactionValues: TransactionFormValue) => {
    if (transactionValues?.id) {
      const values = pick(transactionValues, 'amount', 'notes')

      await updateTransaction
        .mutateAsync(
          {
            id: transactionValues.id,
            data: {
              ...values,
              origin: userId,
              year,
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
            userId: userId!,
            // memberId should only be set for a membership cost
            // associating a membership with its cost
            // it is only set when the transaction record is created for a new membership
            // memberId: membership?.id,
            origin: userId!,
            stripe: false,
            year,
            ...values,
            data: {},
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

export const useTransactionValues = (values: TransactionFormValue | null | undefined): TransactionFormValue => {
  const { userId } = useUser()
  const [year] = useYearFilter()

  return useMemo(
    () => ({
      timestamp: new Date(),
      ...values,
      userId: values?.userId ?? userId!,
      memberId: values?.memberId ?? null,
      amount: values?.amount ?? 0,
      origin: values?.origin ?? userId ?? null,
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
  const trpc = useTRPC()
  const invalidatePaymentQueries = useInvalidatePaymentQueries()
  const createTransaction = useMutation(trpc.transactions.createTransaction.mutationOptions())
  const updateTransaction = useMutation(trpc.transactions.updateTransaction.mutationOptions())
  const notify = useNotification()
  const { userId } = useUser()

  return async (membershipValues: CreateMembershipType, membershipId: number, transactions?: Transaction[]) => {
    const membershipTransactionId = transactions?.find((t) => t?.memberId === membershipId && t?.stripe === false)?.id

    if (membershipTransactionId) {
      await updateTransaction
        .mutateAsync(
          {
            id: membershipTransactionId,
            data: {
              amount: 0 - getMembershipCost(configuration, membershipValues),
              memberId: membershipId,
              year: membershipValues.year,
              notes: getMembershipString(configuration, membershipValues),
              origin: userId,
              stripe: false,
              userId: membershipValues.userId,
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
            amount: 0 - getMembershipCost(configuration, membershipValues),
            memberId: membershipId,
            year: membershipValues.year,
            notes: getMembershipString(configuration, membershipValues),
            origin: userId!,
            stripe: false,
            userId: membershipValues.userId,
            data: {},
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
