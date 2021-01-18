import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useCreateGameSubmissionMutation, useUpdateGameSubmissionByNodeIdMutation } from 'client'
import Acnw, {
  DialogTitle,
  GridContainer,
  GridItem,
  ProfileType,
  TextField,
  useNotification,
  useProfile,
} from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useCallback, useMemo, useState } from 'react'
import { onCloseHandler, pick, range, useSendEmail } from 'utils'
import Yup from 'utils/Yup'

import { MaybeGameChoice, isSlotComplete, orderChoices } from './GameChoiceSelector'
import { choiceType, useEditGameChoice } from './GameSignupPage'
import { ChoiceSummary, SlotSummary } from './SlotDetails'

type FormValues = {
  year: number
  memberId: number
  message: string
  nodeId?: string
  id?: number
}

interface ChoiceConfirmDialogProps {
  open: boolean
  onClose: onCloseHandler
  year: number
  memberId: number
  gameChoices?: MaybeGameChoice[]
  gameSubmission?: FormValues
}

const submissionValidationSchema = Yup.object().shape({
  message: Yup.string().max(1000),
})

type GameChoiceConfirmationEmail = {
  gameChoiceDetails: Record<number, SlotSummary>
  gameSubmission?: FormValues
  profile?: ProfileType | null
  year: number
  update?: boolean
  message: string
}

export const useEditChoiceConfirmation = (onClose: onCloseHandler) => {
  const [createGameSubmission] = useCreateGameSubmissionMutation()
  const [updateGameSubmission] = useUpdateGameSubmissionByNodeIdMutation()
  const [notify] = useNotification()
  const [sendEmail] = useSendEmail()
  const profile = useProfile()

  const sendGameChoiceConfirmation = ({
    gameChoiceDetails,
    year,
    profile,
    message,
    update = false,
  }: GameChoiceConfirmationEmail) => {
    // year, name, email, url, gameChoices, update

    sendEmail({
      type: 'gameChoiceConfirmation',
      body: JSON.stringify({
        year,
        name: profile?.fullName,
        email: profile?.email,
        update,
        message,
        url: `${window.location.origin}/game-choices`,
        gameChoiceDetails,
      }),
    })
  }

  return async (values: FormValues, year: number, gameChoiceDetails: Record<number, SlotSummary>) => {
    if (values.nodeId) {
      await updateGameSubmission({
        variables: {
          input: {
            nodeId: values.nodeId,
            patch: {
              ...pick(values, 'id', 'year', 'memberId', 'message'),
            },
          },
        },
        refetchQueries: ['getGameChoices'],
      })
        .then(() => {
          notify({ text: 'Game Submission updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createGameSubmission({
        variables: {
          input: {
            gameSubmission: {
              ...pick(values, 'nodeId', 'id', 'year', 'memberId', 'message'),
            },
          },
        },
        refetchQueries: ['getGameChoices'],
      })
        .then(() => {
          notify({ text: 'Game Choices Submitted', variant: 'success' })
          sendGameChoiceConfirmation({ gameChoiceDetails, year, profile, message: values.message })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const ChoiceConfirmDialog: React.FC<ChoiceConfirmDialogProps> = ({
  open,
  onClose,
  year,
  memberId,
  gameChoices,
  gameSubmission,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const createOrUpdateChoiceConfirmation = useEditChoiceConfirmation(onClose)
  const [textResults, setTextResults] = useState<Record<number, SlotSummary>>({})
  const [createOrEditGameChoice] = useEditGameChoice()

  const storeTextResults = (details: SlotSummary): void => {
    setTextResults((old) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (old[details.slotId]) {
        return old
      } else {
        return { ...old, [details.slotId]: details }
      }
    })
  }

  const filledOutChoices = useMemo(
    () =>
      range(8, 1).flatMap((slotId) => {
        const thisSlotChoices: choiceType[] = orderChoices(
          gameChoices?.filter((c) => c?.year === year && c.slotId === slotId)
        ) as choiceType[]

        if (!isSlotComplete(thisSlotChoices)) {
          if (!thisSlotChoices[0].gameId && !thisSlotChoices[1].gameId) {
            thisSlotChoices[1] = { ...thisSlotChoices[1], gameId: slotId, modified: true } // yes the no game games have a gameId that matches the slotId
          } else {
            for (let i = 2; i < 5; i++) {
              if (!thisSlotChoices[i].gameId) {
                thisSlotChoices[i] = { ...thisSlotChoices[i], gameId: slotId, modified: true } // yes the no game games have a gameId that matches the slotId
                break
              }
            }
          }
        }
        return thisSlotChoices
      }),
    [gameChoices, year]
  )

  const updateChoices = useCallback(() => {
    const updaters = filledOutChoices
      .filter((c) => c.modified)
      .reduce((acc: Promise<any>[], c, idx, arr) => {
        acc.push(createOrEditGameChoice(c, idx + 1 === arr.length))
        return acc
      }, [])

    Promise.allSettled(updaters).then(() => {
      // console.log('all updaters complete')
    })
  }, [createOrEditGameChoice, filledOutChoices])

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    await createOrUpdateChoiceConfirmation(values, year, textResults)
    updateChoices()
  }

  const values = gameSubmission ?? {
    year,
    memberId,
    message: '',
  }

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>Summary of your Game Selections</DialogTitle>
      <DialogContent>
        <p>
          The following is a preview of your game selections for ACNW {year}. Once you're satisfied that everything is
          in order, select the <strong>Confirm Game Choices</strong> button located at the bottom of this page.
        </p>

        <p>
          Gaming or convention related questions should be sent to <Acnw.ContactEmail />
        </p>
      </DialogContent>
      <DialogContent>
        <ChoiceSummary year={year} gameChoices={filledOutChoices} storeTextResults={storeTextResults} />
      </DialogContent>
      <Formik
        initialValues={values}
        enableReinitialize
        validationSchema={submissionValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogContent>
              <GridContainer spacing={2}>
                <GridItem xs={12} md={12}>
                  <TextField name='message' label='Message for the organizers' margin='normal' fullWidth autoFocus />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Confirm Game Choices
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
