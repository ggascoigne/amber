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

const membershipChargeTransactionType = 'membership charge'
const membershipDonationTransactionType = 'membership donation'

const getTransactionType = ({ data }: Pick<Transaction, 'data'>): string | null => {
  if (typeof data !== 'object' || data === null || !('type' in data)) {
    return null
  }

  return typeof data.type === 'string' ? data.type : null
}

const isManualMembershipTransaction = (transaction: Transaction, membershipId: number) =>
  transaction.memberId === membershipId && transaction.stripe === false

const findMembershipChargeTransaction = (transactions: Array<Transaction>, membershipId: number) => {
  const typedChargeTransaction = transactions.find(
    (transaction) =>
      isManualMembershipTransaction(transaction, membershipId) &&
      getTransactionType(transaction) === membershipChargeTransactionType,
  )

  if (typedChargeTransaction) {
    return typedChargeTransaction
  }

  return transactions.find(
    (transaction) =>
      isManualMembershipTransaction(transaction, membershipId) && getTransactionType(transaction) === null,
  )
}

const findMembershipDonationTransaction = (transactions: Array<Transaction>, membershipId: number) =>
  transactions.find(
    (transaction) =>
      isManualMembershipTransaction(transaction, membershipId) &&
      getTransactionType(transaction) === membershipDonationTransactionType,
  )

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

export const getMembershipDonation = (values: Pick<CreateMembershipType, 'donation'>): number => values.donation ?? 0

export const getMembershipTotal = (configuration: Configuration, values: CreateMembershipType): number =>
  getMembershipCost(configuration, values) + getMembershipDonation(values)

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
  const deleteTransaction = useMutation(trpc.transactions.deleteTransaction.mutationOptions())
  const notify = useNotification()
  const { userId } = useUser()

  return async (membershipValues: CreateMembershipType, membershipId: number, transactions?: Transaction[]) => {
    const existingTransactions = transactions ?? []
    const membershipChargeAmount = getMembershipCost(configuration, membershipValues)
    const membershipDonationAmount = getMembershipDonation(membershipValues)
    const membershipChargeTransaction = findMembershipChargeTransaction(existingTransactions, membershipId)
    const membershipDonationTransaction = findMembershipDonationTransaction(existingTransactions, membershipId)

    const sharedTransactionData = {
      memberId: membershipId,
      year: membershipValues.year,
      origin: userId!,
      stripe: false,
      userId: membershipValues.userId,
    }

    const runMutation = async (mutation: Promise<unknown>) =>
      mutation.catch((error: any) => {
        notify({ text: error.message, variant: 'error' })
        throw error
      })

    try {
      if (membershipChargeTransaction) {
        await runMutation(
          updateTransaction.mutateAsync(
            {
              id: membershipChargeTransaction.id,
              data: {
                amount: 0 - membershipChargeAmount,
                notes: getMembershipString(configuration, membershipValues),
                data: {
                  type: membershipChargeTransactionType,
                },
                ...sharedTransactionData,
              },
            },
            {
              onSuccess: invalidatePaymentQueries,
            },
          ),
        )
      } else {
        await runMutation(
          createTransaction.mutateAsync(
            {
              amount: 0 - membershipChargeAmount,
              notes: getMembershipString(configuration, membershipValues),
              data: {
                type: membershipChargeTransactionType,
              },
              ...sharedTransactionData,
            },
            {
              onSuccess: invalidatePaymentQueries,
            },
          ),
        )
      }

      if (membershipDonationAmount > 0) {
        if (membershipDonationTransaction) {
          await runMutation(
            updateTransaction.mutateAsync(
              {
                id: membershipDonationTransaction.id,
                data: {
                  amount: 0 - membershipDonationAmount,
                  notes: 'Donation',
                  data: {
                    type: membershipDonationTransactionType,
                  },
                  ...sharedTransactionData,
                },
              },
              {
                onSuccess: invalidatePaymentQueries,
              },
            ),
          )
        } else {
          await runMutation(
            createTransaction.mutateAsync(
              {
                amount: 0 - membershipDonationAmount,
                notes: 'Donation',
                data: {
                  type: membershipDonationTransactionType,
                },
                ...sharedTransactionData,
              },
              {
                onSuccess: invalidatePaymentQueries,
              },
            ),
          )
        }
      } else if (membershipDonationTransaction) {
        await runMutation(
          deleteTransaction.mutateAsync(
            {
              id: membershipDonationTransaction.id,
            },
            {
              onSuccess: invalidatePaymentQueries,
            },
          ),
        )
      }

      onClose()
    } catch {
      // Error notifications are handled by runMutation.
    }
  }
}
