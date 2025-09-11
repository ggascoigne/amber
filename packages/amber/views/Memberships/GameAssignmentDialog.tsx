import React, { useMemo } from 'react'

import { CreateGameAssignmentInputType, Schedule, useInvalidateGameAssignmentQueries, useTRPC } from '@amber/client'
import {
  EditDialog,
  GridContainer,
  GridItem,
  Loader,
  OnCloseHandler,
  pick,
  range,
  SelectField,
  TextField,
  useNotification,
} from '@amber/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { dequal as deepEqual } from 'dequal'
import { FormikHelpers } from 'formik'

import { membershipValidationSchemaNW, membershipValidationSchemaUS } from './membershipUtils'

import { TransportError } from '../../components/TransportError'
import { getGameAssignments, useConfiguration, useYearFilter } from '../../utils'
import { MembershipType } from '../../utils/apiTypes'

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

  const gameOptions = useMemo(
    () =>
      range(configuration.numberOfSlots).map((slot) =>
        gData?.filter((g) => g.slotId === slot + 1).map((g) => ({ value: g.id, text: g.name })),
      ),
    [configuration.numberOfSlots, gData],
  )

  if (sError || gError) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return <TransportError error={sError || gError} />
  }
  if (!sData || !gData) {
    return <Loader />
  }

  const empty = (slot: number): GameAssignmentEditNode => ({
    gameId: slot,
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
      if (!deepEqual(gamesAndAssignments[slot], values[slot])) {
        toDelete.push(gamesAndAssignments[slot])
        toCreate.push(values[slot])
      } else {
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
