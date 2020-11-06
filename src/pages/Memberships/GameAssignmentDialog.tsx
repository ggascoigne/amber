import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {
  DialogTitle,
  GraphQLError,
  GridContainer,
  GridItem,
  Loader,
  SelectField,
  TextField,
  useAuth,
  useNotification,
} from 'components/Acnw'
import { dequal as deepEqual } from 'dequal'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { notEmpty, onCloseHandler, pick, range, useYearFilterState } from 'utils'

import {
  GameAssignmentNode,
  useCreateGameAssignmentMutation,
  useDeleteGameAssignmentMutation,
  useGetGamesByYearQuery,
  useGetScheduleQuery,
} from '../../client'
import { getGameAssignments } from '../../utils/gameAssignment'
import { MembershipType, membershipValidationSchema } from './membershipUtils'

type GameAssignmentEditNode = GameAssignmentNode

type FormValues = GameAssignmentEditNode[]

interface GameAssignmentDialogProps {
  open: boolean
  onClose: onCloseHandler
  membership: MembershipType
}

export const GameAssignmentDialog: React.FC<GameAssignmentDialogProps> = ({ open, onClose, membership }) => {
  const year = useYearFilterState((state) => state.year)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [createGameAssignment] = useCreateGameAssignmentMutation()
  const [deleteGameAssignment] = useDeleteGameAssignmentMutation()
  const [notify] = useNotification()

  const memberId = membership?.id ?? 0

  const { error: sError, data: sData } = useGetScheduleQuery({
    variables: { memberId },
    skip: !memberId,
    fetchPolicy: 'cache-and-network',
  })

  const { error: gError, data: gData } = useGetGamesByYearQuery({
    variables: {
      year,
    },
    fetchPolicy: 'cache-and-network',
  })

  const gameOptions = useMemo(() => {
    const games = gData?.games?.edges.map((v) => v.node).filter(notEmpty)
    return range(7).map((slot) =>
      games?.filter((g) => g.slotId === slot + 1).map((g) => ({ value: g.id, text: g.name }))
    )
  }, [gData])

  if (sError || gError) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return <GraphQLError error={sError || gError} />
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
    range(8, 1).map((slot) => assignments?.find((a) => a?.game?.slotId === slot) ?? empty(slot))

  const gamesAndAssignments = fillAssignments(getGameAssignments(sData, memberId)).map((ga) =>
    pick(ga, 'gameId', 'gm', 'memberId', 'year', 'nodeId')
  )

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const toDelete: GameAssignmentEditNode[] = []
    const toCreate: GameAssignmentEditNode[] = []

    range(7).forEach((slot) => {
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
        deleteGameAssignment({ variables: { input: { nodeId: assignment.nodeId! } } }).catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
      )
    })
    toCreate.forEach((assignment) => {
      updaters.push(
        createGameAssignment({
          variables: {
            input: {
              gameAssignment: pick(assignment, 'gameId', 'gm', 'memberId', 'year'),
            },
          },
          refetchQueries: ['getGameAssignmentsByYear', 'getSchedule'],
        }).catch((error) => {
          console.log(`error = ${JSON.stringify(error, null, 2)}`)
          if (!error?.message?.include('duplicate key')) notify({ text: error.message, variant: 'error' })
        })
      )
    })
    await Promise.all(updaters)
    onClose()
  }

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <Formik
        initialValues={gamesAndAssignments}
        enableReinitialize
        validationSchema={membershipValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>Edit Game Assignments</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
