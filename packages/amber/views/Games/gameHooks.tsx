import { useCallback, useMemo } from 'react'

import {
  MembershipAndUserAndRoom,
  UserAndProfile,
  useTRPC,
  useInvalidateGameAssignmentQueries,
  useInvalidateGameQueries,
  Game,
  ToFormValues,
} from '@amber/client'
import { notEmpty, OnCloseHandler, pickAndConvertNull, useNotification, Expand } from '@amber/ui'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Perms, useAuth } from '../../components/Auth'
import { useProfile } from '../../components/Profile'
import { useConfiguration, useSendEmail, useFlag, useUser, useYearFilter } from '../../utils'

type Membership = MembershipAndUserAndRoom

export const gameQueries = ['getGamesByYear', 'getGamesByYearAndAuthor', 'getGameAssignmentsByGameId']

const getKnownNames = (gmNames: string | null | undefined, membershipList: Membership[]) => {
  if (!gmNames) return []

  return gmNames
    .toLocaleLowerCase()
    .split('\n')
    .map((name) => {
      const cleanedName = name.trim()
      const member = membershipList.find((m) => {
        const fullName = m.user?.fullName ?? ''
        const firstAndLast = `${m.user?.firstName} ${m.user?.lastName}`
        const displayName = m.user?.displayName ?? ''
        const pat = new RegExp(`${m.user?.firstName?.slice(0, 3)}\\w?\\s+${m.user?.lastName}`, 'i')
        const patMatch = pat.exec(cleanedName)
        return (
          cleanedName === fullName.toLocaleLowerCase() ||
          cleanedName === firstAndLast.toLocaleLowerCase() ||
          !!patMatch ||
          cleanedName === displayName.toLocaleLowerCase()
        )
      })
      return member?.user?.fullName
    })
    .filter(notEmpty)
}

export const useUpdateGameAssignment = () => {
  const trpc = useTRPC()
  const [year] = useYearFilter()
  const notify = useNotification()
  const createGameAssignment = useMutation(trpc.gameAssignments.createGameAssignment.mutationOptions())
  const deleteGameAssignment = useMutation(trpc.gameAssignments.deleteGameAssignment.mutationOptions())
  const invalidateGameQueries = useInvalidateGameQueries()
  const invalidateGameAssignmentQueries = useInvalidateGameAssignmentQueries()

  const { data: gameAssignmentData } = useQuery(
    trpc.gameAssignments.getGameAssignmentsByYear.queryOptions({
      year,
    }),
  )

  return useCallback(
    async (gameId: number, gmNames: string | null | undefined, membershipList: Membership[]) => {
      const gmMemberNames: string[] = getKnownNames(gmNames, membershipList)
      const gmMemberships = membershipList.filter((m) => {
        if (!m.user) return false
        const { fullName } = m.user
        return fullName ? gmMemberNames.indexOf(fullName) !== -1 : false
      })
      if (gameAssignmentData) {
        // first clean up any out of date assignments
        const oldAssignments = gameAssignmentData
          .filter(notEmpty)
          .filter((ga) => ga.gameId === gameId)
          .filter((ga) => ga.gm < 0)

        const oldIds = oldAssignments.map((o) => o.memberId).sort((a, b) => a - b)
        const newIds = gmMemberships.map((m) => m.id).sort((a, b) => a - b)
        const equal = oldIds.length === newIds.length && oldIds.every((v, i) => v === newIds[i])
        if (equal) {
          // nothing to do
          return
        }

        const updaters: Promise<any>[] = []
        oldAssignments.forEach((oldAssignment) => {
          updaters.push(
            deleteGameAssignment
              .mutateAsync({
                gameId: oldAssignment.gameId,
                memberId: oldAssignment.memberId,
                year: oldAssignment.year,
                gm: oldAssignment.gm,
              })
              .catch((error) => {
                notify({ text: error.message, variant: 'error' })
              }),
          )
        })
        await Promise.allSettled(updaters)
      }

      const updaters: Promise<any>[] = []
      gmMemberships.forEach((m, index) => {
        updaters.push(
          createGameAssignment
            .mutateAsync(
              {
                gameId,
                memberId: m.id,
                gm: -(index + 1),
                year,
              },
              {
                onSuccess: () => {
                  invalidateGameAssignmentQueries()
                  invalidateGameQueries()
                },
              },
            )
            .catch((error) => {
              console.log(`error = ${JSON.stringify(error, null, 2)}`)
              if (!error?.message?.include('duplicate key')) notify({ text: error.message, variant: 'error' })
            }),
        )
      })
      await Promise.allSettled(updaters)
    },
    [
      createGameAssignment,
      deleteGameAssignment,
      gameAssignmentData,
      invalidateGameAssignmentQueries,
      invalidateGameQueries,
      notify,
      year,
    ],
  )
}

export type GameDialogFormValues = Expand<
  ToFormValues<Omit<Game, 'gameAssignment' | 'authorId' | 'room' | 'shortName'>>
>

export const useEditGame = (onClose: OnCloseHandler, _initialValues?: GameDialogFormValues) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const createGame = useMutation(trpc.games.createGame.mutationOptions())
  const updateGame = useMutation(trpc.games.updateGame.mutationOptions())
  const invalidateGameQueries = useInvalidateGameQueries()
  const notify = useNotification()
  const sendEmail = useSendEmail()
  const profile = useProfile()
  const { userId } = useUser()
  const sendAdminEmail = useFlag('send_admin_email')
  const { hasPermissions } = useAuth()
  const shouldSendEmail = !(hasPermissions(Perms.IsAdmin, { ignoreOverride: true }) || sendAdminEmail)
  const [year] = useYearFilter()
  const setGameGmAssignments = useUpdateGameAssignment()
  const { data: membershipData } = useQuery(
    trpc.memberships.getMembershipsByYear.queryOptions({
      year,
    }),
  )

  const membershipList: Membership[] = useMemo(() => membershipData?.filter(notEmpty) ?? [], [membershipData])

  return useCallback(
    async (values: GameDialogFormValues) => {
      const sendGameConfirmation = (p: UserAndProfile, v: GameDialogFormValues, update = false) => {
        sendEmail({
          type: 'gameConfirmation',
          body: {
            year,
            name: p.fullName!,
            email: p.email,
            url: `${window.location.origin}/gm`,
            game: v,
            update,
          },
        })
      }

      // eslint-disable-next-line no-param-reassign
      if (values.slotId === 0) values.slotId = null

      const fields = pickAndConvertNull(
        values,
        'name',
        'gmNames',
        'description',
        'genre',
        'type',
        'setting',
        'charInstructions',
        'playerMin',
        'playerMax',
        'playerPreference',
        'returningPlayers',
        'playersContactGm',
        'gameContactEmail',
        'estimatedLength',
        'slotPreference',
        'lateStart',
        'lateFinish',
        'slotConflicts',
        'message',
        'teenFriendly',
        'slotId',
        'full',
        'roomId',
      )

      if (values.id) {
        await updateGame
          .mutateAsync(
            {
              id: values.id,
              data: {
                ...fields,
              },
            },
            {
              onSuccess: invalidateGameQueries,
            },
          )
          .then(async () => {
            await setGameGmAssignments(values.id!, values.gmNames, membershipList)
            notify({ text: 'Game updated', variant: 'success' })
            // create always sends email, but generally updates skip sending email about admin updates
            if (shouldSendEmail && profile) {
              sendGameConfirmation(profile, values, true)
            }
            onClose()
          })
          .catch((error) => {
            notify({ text: error.message, variant: 'error' })
          })
      } else {
        await createGame
          .mutateAsync(
            {
              ...fields,
              year: configuration.year,
              authorId: userId,
            },
            {
              onSuccess: invalidateGameQueries,
            },
          )
          .then(async (res) => {
            const gameId = res?.game?.id
            gameId && (await setGameGmAssignments(gameId, values.gmNames, membershipList))
            notify({ text: 'Game created', variant: 'success' })
            profile && sendGameConfirmation(profile, values)
            onClose()
          })
          .catch((error) => {
            notify({ text: error.message, variant: 'error' })
          })
      }
    },
    [
      configuration.year,
      createGame,
      invalidateGameQueries,
      membershipList,
      notify,
      onClose,
      profile,
      sendEmail,
      setGameGmAssignments,
      shouldSendEmail,
      updateGame,
      userId,
      year,
    ],
  )
}
