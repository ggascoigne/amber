import React, { useMemo } from 'react'

import { dequal as deepEqual } from 'dequal'
import { FormikHelpers } from 'formik'
import {
  EditDialog,
  GridContainer,
  GridItem,
  Loader,
  notEmpty,
  OnCloseHandler,
  pick,
  range,
  SelectField,
  TextField,
  useNotification,
} from 'ui'

import { membershipValidationSchemaNW, membershipValidationSchemaUS } from './membershipUtils'

import {
  GameAssignmentNode,
  useGraphQL,
  useGraphQLMutation,
  CreateGameAssignmentDocument,
  DeleteGameAssignmentDocument,
  GetGamesByYearDocument,
  GetScheduleDocument,
} from '../../client'
import { useInvalidateGameAssignmentQueries } from '../../client/querySets'
import { TransportError } from '../../components/TransportError'
import { getGameAssignments, useConfiguration, useYearFilter } from '../../utils'
import { MembershipType } from '../../utils/apiTypes'

type GameAssignmentEditNode = GameAssignmentNode

type FormValues = GameAssignmentEditNode[]

interface GameAssignmentDialogProps {
  open: boolean
  onClose: OnCloseHandler
  membership: MembershipType
}

export const GameAssignmentDialog: React.FC<GameAssignmentDialogProps> = ({ open, onClose, membership }) => {
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const createGameAssignment = useGraphQLMutation(CreateGameAssignmentDocument)
  const deleteGameAssignment = useGraphQLMutation(DeleteGameAssignmentDocument)
  const invalidateGameAssignmentQueries = useInvalidateGameAssignmentQueries()
  const notify = useNotification()

  const memberId = membership.id ?? 0

  const { error: sError, data: sData } = useGraphQL(
    GetScheduleDocument,
    { memberId },
    {
      enabled: !!memberId,
    },
  )

  const { error: gError, data: gData } = useGraphQL(GetGamesByYearDocument, {
    year,
  })

  const gameOptions = useMemo(() => {
    const games = gData?.games?.edges.map((v) => v.node).filter(notEmpty)
    return range(configuration.numberOfSlots).map((slot) =>
      games?.filter((g) => g.slotId === slot + 1).map((g) => ({ value: g.id, text: g.name })),
    )
  }, [configuration.numberOfSlots, gData?.games?.edges])

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

  const fillAssignments = (assignments?: GameAssignmentEditNode[]) =>
    range(configuration.numberOfSlots + 1, 1).map(
      (slot) => assignments?.find((a) => a.game?.slotId === slot) ?? empty(slot),
    )

  const gamesAndAssignments = fillAssignments(getGameAssignments(sData, memberId)).map((ga) =>
    pick(ga, 'gameId', 'gm', 'memberId', 'year', 'nodeId'),
  )

  const onSubmit = async (values: FormValues, _actions: FormikHelpers<FormValues>) => {
    const toDelete: GameAssignmentEditNode[] = []
    const toCreate: GameAssignmentEditNode[] = []

    range(configuration.numberOfSlots).forEach((slot) => {
      if (!deepEqual(gamesAndAssignments[slot], values[slot])) {
        if (gamesAndAssignments[slot]?.nodeId) {
          toDelete.push(gamesAndAssignments[slot])
        }
        toCreate.push(values[slot])
      } else if (!values[slot]?.nodeId) {
        toCreate.push(values[slot])
      }
    })
    console.log({ toDelete, toCreate })
    const updaters: Promise<any>[] = []
    toDelete.forEach((assignment) => {
      updaters.push(
        deleteGameAssignment.mutateAsync({ input: { nodeId: assignment.nodeId! } }).catch((error) => {
          notify({ text: error.message, variant: 'error' })
        }),
      )
    })
    toCreate.forEach((assignment) => {
      updaters.push(
        createGameAssignment
          .mutateAsync(
            {
              input: {
                gameAssignment: pick(assignment, 'gameId', 'gm', 'memberId', 'year'),
              },
            },
            {
              onSuccess: invalidateGameAssignmentQueries,
            },
          )
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
      // todo: what are we validating game assignments against a membership schema here in?
      validationSchema={
        configuration.useUsAttendanceOptions ? membershipValidationSchemaUS : membershipValidationSchemaNW
      }
      isEditing
    >
      <GridContainer spacing={2}>
        {gamesAndAssignments.map((g, index) => (
          <React.Fragment key={index}>
            <GridItem xs={12} md={8} style={{ paddingTop: 0, paddingBottom: 0 }}>
              <SelectField
                name={`[${index}].gameId`}
                label={`Slot ${index + 1}`}
                margin='dense'
                fullWidth
                selectValues={gameOptions[index]}
              />
            </GridItem>
            <GridItem xs={12} md={4} style={{ paddingTop: 0, paddingBottom: 0 }}>
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
