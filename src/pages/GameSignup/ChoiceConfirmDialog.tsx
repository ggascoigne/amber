import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useCreateGameSubmissionMutation, useUpdateGameSubmissionByNodeIdMutation } from 'client'
import Acnw, {
  DialogTitle,
  GraphQLError,
  GridContainer,
  GridItem,
  ProfileType,
  TextField,
  useNotification,
  useProfile,
} from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { onCloseHandler, pick, useSendEmail, useSetting } from 'utils'
import Yup from 'utils/Yup'

import { useAuth } from '../../components/Acnw/Auth/Auth0'
import { Perms } from '../../components/Acnw/Auth/PermissionRules'
import { MaybeGameChoice } from './GameChoiceSelector'
import { ChoiceSummary, SlotSummary } from './SlotDetails'

type FormValues = {
  year: number
  memberId?: number
  message: string
  nodeId?: string
  id?: number
}

interface ChoiceConfirmDialog {
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
  const sendAdminEmail = useSetting('send.admin.email')
  const { hasPermissions } = useAuth()
  const shouldSendEmail = !(hasPermissions(Perms.IsAdmin, { ignoreOverride: true }) || sendAdminEmail)
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
            nodeId: values.nodeId!,
            patch: {
              ...pick(values, 'id', 'year', 'memberId', 'message'),
            },
          },
        },
        refetchQueries: ['GetGameChoices'],
      })
        .then(() => {
          notify({ text: 'Game Submission updated', variant: 'success' })
          // sendGameChoiceConfirmation({ gameChoiceDetails, year, profile, message: values.message }) // todo remove
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
        refetchQueries: ['GetGameChoices'],
      })
        .then((res) => {
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

export const ChoiceConfirmDialog: React.FC<ChoiceConfirmDialog> = ({
  open,
  onClose,
  year,
  memberId,
  gameChoices,
  gameSubmission,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const createOrUpdateSetting = useEditChoiceConfirmation(onClose)
  const [textResults, setTextResults] = useState<Record<number, SlotSummary>>({})

  const storeTextResults = (details: SlotSummary): void => {
    setTextResults((old) => {
      if (old[details.slotId]) {
        return old
      } else {
        return { ...old, [details.slotId]: details }
      }
    })
  }

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    await createOrUpdateSetting(values, year, textResults)
    console.log(`textResults = ${JSON.stringify(textResults, null, 2)}`)
    console.log(`values = ${JSON.stringify(values, null, 2)}`)
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

        <ul>
          {/*
            <li>In the Messages section, please let us know if you'll be arriving late for any particular
            game slot (for example, if your plane gets in late on Thursday or Friday), so we can pass this
            information on to your GM. Also let us know if you are planning to leave early on Sunday.</li>
*/}
          <li>
            If you are a returning player in a game, please let us know. Also, if you are signing up for a returning
            player game and are NOT a returning player, you may still get in, but to be safe please indicate a fourth
            choice game for that slot.
          </li>
        </ul>

        <p>
          Note that we cannot guarantee your selections but will fill games (before the deadline) on a first come, first
          served basis - moderated so everyone has at least one first-choice game in their schedule. Gaming or
          convention related questions should be sent to <Acnw.ContactEmail />
        </p>
      </DialogContent>
      <DialogContent>
        <ChoiceSummary year={year} gameChoices={gameChoices} storeTextResults={storeTextResults} />
      </DialogContent>
      <Formik initialValues={values} validationSchema={submissionValidationSchema} onSubmit={onSubmit}>
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
