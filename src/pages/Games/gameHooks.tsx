import {
  GameAssignmentFieldsFragment,
  GameFieldsFragment,
  GameGmsFragment,
  MembershipFieldsFragment,
  Node,
  useCreateGameAssignmentMutation,
  useCreateGameMutation,
  useDeleteGameAssignmentMutation,
  useGetGameAssignmentsByYearQuery,
  useGetMembershipsByYearQuery,
  useUpdateGameByNodeIdMutation,
} from 'client'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { configuration, notEmpty, onCloseHandler, pick, useSendEmail, useSetting, useUser, useYearFilter } from 'utils'

import { Perms, useAuth } from '../../components/Auth'
import { useNotification } from '../../components/Notifications'
import { ProfileType, useProfile } from '../../components/Profile'

type GameFields = Omit<GameFieldsFragment, 'nodeId' | 'id' | '__typename' | 'gameAssignments'>

type GameAssignment = GameAssignmentFieldsFragment

type Membership = MembershipFieldsFragment

export const gameQueries = ['getGamesByYear', 'getGamesByYearAndAuthor', 'getGameAssignmentsByGameId']

export const useUpdateGameAssignment = () => {
  const [year] = useYearFilter()
  const [notify] = useNotification()
  const createGameAssignment = useCreateGameAssignmentMutation()
  const deleteGameAssignment = useDeleteGameAssignmentMutation()
  const queryClient = useQueryClient()
  const { data: gameAssignmentData } = useGetGameAssignmentsByYearQuery({
    year,
  })

  const getKnownNames = (gmNames: string | null | undefined, membershipList: Membership[]) => {
    if (!gmNames) return []
    return membershipList
      .map((m) => {
        const fullName = m.user?.fullName
        const firstAndLast = `${m.user?.firstName} ${m.user?.lastName}`
        const pat = new RegExp(`${m.user?.firstName?.slice(0, 3)}\\w+\\s+${m.user?.lastName}`)
        return (
          (fullName && gmNames.includes(fullName) ? fullName : undefined) ??
          (firstAndLast && gmNames.includes(firstAndLast) ? fullName : undefined) ??
          (pat.exec(gmNames) ? fullName : undefined)
        )
      })
      .filter(notEmpty)
  }

  return useCallback(
    async (gameId: number, gmNames: string | null | undefined, membershipList: Membership[]) => {
      const gmMemberNames: string[] = getKnownNames(gmNames, membershipList)
      const gmMemberships = membershipList.filter((m) => {
        if (!m.user) return false
        const fullName = m.user.fullName
        return fullName ? gmMemberNames.indexOf(fullName) !== -1 : false
      })
      if (gameAssignmentData) {
        // first clean up any out of date assignments
        const oldAssignments = gameAssignmentData.gameAssignments?.nodes
          .filter(notEmpty)
          .filter((ga) => ga.gameId === gameId)
          .filter((ga) => ga.gm !== 0) as GameAssignment[]

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
            deleteGameAssignment.mutateAsync({ input: { nodeId: oldAssignment.nodeId } }).catch((error) => {
              notify({ text: error.message, variant: 'error' })
            })
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
                input: {
                  gameAssignment: {
                    gameId,
                    memberId: m.id,
                    gm: -(index + 1),
                    year,
                  },
                },
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries('getGameAssignmentsByYear')
                  gameQueries.forEach((q) => queryClient.invalidateQueries(q))
                },
              }
            )
            .catch((error) => {
              console.log(`error = ${JSON.stringify(error, null, 2)}`)
              if (!error?.message?.include('duplicate key')) notify({ text: error.message, variant: 'error' })
            })
        )
      })
      await Promise.allSettled(updaters)
    },
    [createGameAssignment, deleteGameAssignment, gameAssignmentData, notify, queryClient, year]
  )
}

export type GameDialogFormValues = Omit<
  GameFieldsFragment & GameGmsFragment,
  'nodeId' | 'id' | '__typename' | 'gameAssignments'
> &
  Partial<{ id: number }> &
  Partial<Node>

export const useEditGame = (onClose: onCloseHandler, initialValues?: GameDialogFormValues) => {
  const createGame = useCreateGameMutation()
  const updateGame = useUpdateGameByNodeIdMutation()
  const queryClient = useQueryClient()
  const [notify] = useNotification()
  const [sendEmail] = useSendEmail()
  const profile = useProfile()
  const { userId } = useUser()
  const sendAdminEmail = useSetting('send.admin.email')
  const { hasPermissions } = useAuth()
  const shouldSendEmail = !(hasPermissions(Perms.IsAdmin, { ignoreOverride: true }) || sendAdminEmail)
  const [year] = useYearFilter()
  const setGameGmAssignments = useUpdateGameAssignment()
  const { data: membershipData } = useGetMembershipsByYearQuery({
    year,
  })

  const membershipList: Membership[] = useMemo(
    () => membershipData?.memberships?.nodes.filter(notEmpty) ?? [],
    [membershipData?.memberships?.nodes]
  )

  return useCallback(
    async (values: GameDialogFormValues) => {
      const sendGameConfirmation = (profile: ProfileType, values: GameFields, update = false) => {
        sendEmail({
          type: 'gameConfirmation',
          body: JSON.stringify({
            year,
            name: profile.fullName,
            email: profile.email,
            url: `${window.location.origin}/gm`,
            game: values,
            update,
          }),
        })
      }

      if (values.slotId === 0) values.slotId = null

      const fields = pick(
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
        'full'
      )

      if (values.nodeId) {
        await updateGame
          .mutateAsync(
            {
              input: {
                nodeId: values.nodeId,
                patch: {
                  ...fields,
                },
              },
            },
            {
              onSuccess: () => {
                gameQueries.forEach((q) => queryClient.invalidateQueries(q))
              },
            }
          )
          .then(async () => {
            await setGameGmAssignments(values.id!, values.gmNames, membershipList)
            notify({ text: 'Game updated', variant: 'success' })
            // create always sends email, but generally updates skip sending email about admin updates
            if (shouldSendEmail) {
              sendGameConfirmation(profile!, values, true)
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
              input: {
                game: {
                  ...fields,
                  year: configuration.year,
                  authorId: userId,
                },
              },
            },
            {
              onSuccess: () => {
                gameQueries.forEach((q) => queryClient.invalidateQueries(q))
              },
            }
          )
          .then(async (res) => {
            const gameId = res?.createGame?.game?.id
            gameId && (await setGameGmAssignments(gameId, values.gmNames, membershipList))
            notify({ text: 'Game created', variant: 'success' })
            sendGameConfirmation(profile!, values)
            onClose()
          })
          .catch((error) => {
            notify({ text: error.message, variant: 'error' })
          })
      }
    },
    [
      createGame,
      membershipList,
      notify,
      onClose,
      profile,
      queryClient,
      sendEmail,
      setGameGmAssignments,
      shouldSendEmail,
      updateGame,
      userId,
      year,
    ]
  )
}
