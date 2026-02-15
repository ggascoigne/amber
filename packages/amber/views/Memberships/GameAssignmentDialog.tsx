import React, { useMemo } from 'react'

import type { CreateGameAssignmentInputType, Schedule } from '@amber/client'
import { useInvalidateGameAssignmentQueries, useTRPC } from '@amber/client'
import type { OnCloseHandler } from '@amber/ui'
import {
  EditDialog,
  GridContainer,
  GridItem,
  Loader,
  pick,
  range,
  SelectField,
  TextField,
  useNotification,
} from '@amber/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { dequal as deepEqual } from 'dequal'
import type { FormikHelpers } from 'formik'

import { membershipValidationSchemaNW, membershipValidationSchemaUS } from './membershipUtils'

import { TransportError } from '../../components/TransportError'
import { getGameAssignments, isAnyGameCategory, isNoGameCategory, useConfiguration, useYearFilter } from '../../utils'
import type { MembershipType } from '../../utils/apiTypes'

type GameAssignmentEditNode = CreateGameAssignmentInputType

type FormValues = GameAssignmentEditNode[]

interface GameAssignmentDialogProps {
  open: boolean
  onClose: OnCloseHandler
  membership: MembershipType
}

export const GameAssignmentDialog: React.FC<GameAssignmentDialogProps> = ({ open, onClose, membership }) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const createGameAssignment = useMutation(trpc.gameAssignments.createGameAssignment.mutationOptions())
  const deleteGameAssignment = useMutation(trpc.gameAssignments.deleteGameAssignment.mutationOptions())
  const invalidateGameAssignmentQueries = useInvalidateGameAssignmentQueries()
  const notify = useNotification()

  const memberId = membership.id ?? 0

  const { error: sError, data: sData } = useQuery(
    trpc.gameAssignments.getSchedule.queryOptions(
      {
        memberId,
      },
      {
        enabled: !!membership,
      },
    ),
  )

  const { error: gError, data: gData } = useQuery(
    trpc.games.getGamesByYear.queryOptions(
      {
        year,
      },
      {
        enabled: !!year,
      },
    ),
  )

  const gameOptions = useMemo(() => {
    const optionsBySlotId = new Map<number, Array<{ value: number; text: string }>>()

    range(configuration.numberOfSlots + 1, 1).forEach((slotId) => {
      const options = (gData ?? [])
        .filter((game) => game.slotId === slotId && !isAnyGameCategory(game.category))
        .sort((left, right) => {
          const leftNoGame = isNoGameCategory(left.category)
          const rightNoGame = isNoGameCategory(right.category)
          if (leftNoGame !== rightNoGame) return leftNoGame ? -1 : 1
          return left.name.localeCompare(right.name)
        })
        .map((game) => ({ value: game.id, text: game.name }))

      optionsBySlotId.set(slotId, options)
    })

    return range(configuration.numberOfSlots).map((slot) => optionsBySlotId.get(slot + 1) ?? [])
  }, [configuration.numberOfSlots, gData])
  const noGameIdBySlotId = useMemo(
    () =>
      new Map(
        (gData ?? [])
          .filter((game) => isNoGameCategory(game.category) && (game.slotId ?? 0) > 0)
          .map((game) => [game.slotId as number, game.id]),
      ),
    [gData],
  )

  if (sError || gError) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return <TransportError error={sError || gError} />
  }
  if (!sData || !gData) {
    return <Loader />
  }

  const getDefaultGameIdForSlot = (slot: number) => noGameIdBySlotId.get(slot) ?? gameOptions[slot - 1]?.[0]?.value ?? 0

  const empty = (slot: number): GameAssignmentEditNode => ({
    gameId: getDefaultGameIdForSlot(slot),
    gm: 0,
    memberId,
    year,
  })

  const fillAssignments = (assignments?: Schedule[]) =>
    range(configuration.numberOfSlots + 1, 1).map(
      (slot) => assignments?.find((a) => a.game?.slotId === slot) ?? empty(slot),
    )

  const gamesAndAssignments = fillAssignments(getGameAssignments(sData, memberId)).map((ga) =>
    pick(ga, 'gameId', 'gm', 'memberId', 'year'),
  )

  const onSubmit = async (values: FormValues, _actions: FormikHelpers<FormValues>) => {
    const toDelete: GameAssignmentEditNode[] = []
    const toCreate: GameAssignmentEditNode[] = []

    range(configuration.numberOfSlots).forEach((slot) => {
      if (gamesAndAssignments[slot]) {
        if (!deepEqual(gamesAndAssignments[slot], values[slot])) {
          toDelete.push(gamesAndAssignments[slot])
          if (values[slot]) {
            toCreate.push(values[slot])
          }
        } else {
          // do nothing
        }
      } else if (values[slot]) {
        toCreate.push(values[slot])
      }
    })
    console.log({ toDelete, toCreate })
    const updaters: Promise<any>[] = []
    toDelete.forEach((assignment) => {
      updaters.push(
        deleteGameAssignment.mutateAsync(pick(assignment, 'gameId', 'gm', 'memberId', 'year')).catch((error) => {
          notify({ text: error.message, variant: 'error' })
        }),
      )
    })
    toCreate.forEach((assignment) => {
      updaters.push(
        createGameAssignment
          .mutateAsync(pick(assignment, 'gameId', 'gm', 'memberId', 'year'), {
            onSuccess: invalidateGameAssignmentQueries,
          })
          .catch((error) => {
            console.log(`error = ${JSON.stringify(error, null, 2)}`)
            if (!error?.message?.include('duplicate key')) notify({ text: error.message, variant: 'error' })
          }),
      )
    })
    await Promise.allSettled(updaters)
    onClose()
  }

  return (
    <EditDialog
      initialValues={gamesAndAssignments}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Game Assignments'
      // TODO: why are we validating game assignments against a membership schema here in?
      validationSchema={configuration.isAcus ? membershipValidationSchemaUS : membershipValidationSchemaNW}
      isEditing
    >
      <GridContainer spacing={2}>
        {gamesAndAssignments.map((g, index) => (
          <React.Fragment key={index}>
            <GridItem size={{ xs: 12, md: 8 }} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <SelectField
                name={`[${index}].gameId`}
                label={`Slot ${index + 1}`}
                margin='dense'
                fullWidth
                selectValues={gameOptions[index]}
              />
            </GridItem>
            <GridItem size={{ xs: 12, md: 4 }} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <TextField
                name={`[${index}].gm`}
                label='GM'
                margin='dense'
                fullWidth
                type='number'
                required
                InputProps={{ inputProps: { min: 0, max: 10 } }}
              />
            </GridItem>
          </React.Fragment>
        ))}
      </GridContainer>
    </EditDialog>
  )
}
