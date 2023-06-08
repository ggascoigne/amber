import React, { useCallback, useMemo, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import {
  DialogTitle,
  GridContainer,
  GridItem,
  OnCloseHandler,
  pick,
  range,
  TextField,
  useDisableBackdropClick,
  useNotification,
} from 'ui'
import Yup from 'ui/utils/Yup'

import { isSlotComplete, MaybeGameChoice, orderChoices } from './GameChoiceSelector'
import { ChoiceType, useEditGameChoice } from './GameSignupPage'
import { ChoiceSummary, SlotSummary } from './SlotDetails'

import { useCreateGameSubmissionMutation, useUpdateGameSubmissionByNodeIdMutation } from '../../client'
import { useInvalidateGameChoiceQueries } from '../../client/querySets'
import { ContactEmail } from '../../components'
import { ProfileFormType, useProfile } from '../../components/Profile'
import { useConfiguration, useSendEmail } from '../../utils'

interface FormValues {
  year: number
  memberId: number
  message: string
  nodeId?: string
  id?: number
}

interface ChoiceConfirmDialogProps {
  open: boolean
  onClose: OnCloseHandler
  year: number
  memberId: number
  gameChoices?: MaybeGameChoice[]
  gameSubmission?: FormValues
}

const submissionValidationSchema = Yup.object().shape({
  message: Yup.string().max(1000),
})

interface GameChoiceConfirmationEmail {
  gameChoiceDetails: Record<number, SlotSummary>
  gameSubmission?: FormValues
  profile: ProfileFormType
  year: number
  update?: boolean
  message: string
}

export const useEditChoiceConfirmation = (onClose: OnCloseHandler) => {
  const createGameSubmission = useCreateGameSubmissionMutation()
  const updateGameSubmission = useUpdateGameSubmissionByNodeIdMutation()
  const invalidateGameChoiceQueries = useInvalidateGameChoiceQueries()

  const notify = useNotification()
  const sendEmail = useSendEmail()
  const profile = useProfile()

  const sendGameChoiceConfirmation = ({
    gameChoiceDetails,
    year,
    profile: profileInner,
    message,
    update = false,
  }: GameChoiceConfirmationEmail) => {
    sendEmail({
      type: 'gameChoiceConfirmation',
      body: {
        year,
        name: profileInner.fullName!,
        email: profileInner.email,
        update,
        message,
        url: `${window.location.origin}/game-choices`,
        gameChoiceDetails,
      },
    })
  }

  return async (values: FormValues, year: number, gameChoiceDetails: Record<number, SlotSummary>) => {
    if (values.nodeId) {
      await updateGameSubmission
        .mutateAsync(
          {
            input: {
              nodeId: values.nodeId,
              patch: {
                ...pick(values, 'id', 'year', 'memberId', 'message'),
              },
            },
          },
          {
            onSuccess: invalidateGameChoiceQueries,
          }
        )
        .then(() => {
          notify({ text: 'Game Submission updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createGameSubmission
        .mutateAsync(
          {
            input: {
              gameSubmission: {
                ...pick(values, 'nodeId', 'id', 'year', 'memberId', 'message'),
              },
            },
          },
          {
            onSuccess: invalidateGameChoiceQueries,
          }
        )
        .then(() => {
          notify({ text: 'Game Choices Submitted', variant: 'success' })
          sendGameChoiceConfirmation({ gameChoiceDetails, year, profile: profile!, message: values.message })
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
  const configuration = useConfiguration()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const createOrUpdateChoiceConfirmation = useEditChoiceConfirmation(onClose)
  const [textResults, setTextResults] = useState<Record<number, SlotSummary>>({})
  const [createOrEditGameChoice] = useEditGameChoice()
  const handleClose = useDisableBackdropClick(onClose)

  const storeTextResults = (details: SlotSummary): void => {
    setTextResults((old) => {
      if (old[details.slotId]) {
        return old
      }
      return { ...old, [details.slotId]: details }
    })
  }

  const filledOutChoices = useMemo(
    () =>
      range(configuration.numberOfSlots + 1, 1).flatMap((slotId) => {
        const thisSlotChoices: ChoiceType[] = orderChoices(
          gameChoices?.filter((c) => c?.year === year && c.slotId === slotId)
        ) as ChoiceType[]

        if (!isSlotComplete(configuration, thisSlotChoices)) {
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
    [configuration, gameChoices, year]
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

  const onSubmit = async (values: FormValues, _actions: FormikHelpers<FormValues>) => {
    await createOrUpdateChoiceConfirmation(values, year, textResults)
    updateChoices()
  }

  const values = gameSubmission ?? {
    year,
    memberId,
    message: '',
  }

  return (
    <Dialog fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle onClose={onClose}>Summary of your Game Selections</DialogTitle>
      <DialogContent>
        <p>
          The following is a preview of your game selections for {configuration.name} {year}. Once you're satisfied that
          everything is in order, select the <strong>Confirm Game Choices</strong> button located at the bottom of this
          page.
        </p>

        <p>
          Gaming or convention related questions should be sent to <ContactEmail />
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
        {({ isSubmitting }) => (
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
