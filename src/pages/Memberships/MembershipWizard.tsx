import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useUpdateUserMutation } from 'client'
import { DialogClose, ProfileFormContent, ProfileType, useAuth, useNotification } from 'components/Acnw'
import { profileValidationSchema } from 'components/Acnw/Profile/profileValidationSchema'
import { Form, Formik, FormikErrors, FormikHelpers, FormikTouched, FormikValues } from 'formik'
import React, { useMemo } from 'react'
import { useUser } from 'utils'
import Yup from 'utils/Yup'

import { FinalStep } from './FinalStep'
import { IntroStep } from './IntroStep'
import { MembershipStep } from './MembershipStep'
import {
  MembershipType,
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'

type FormValues = {
  membership: MembershipType
  profile: ProfileType
}

interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: ProfileType
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

const validationSchema = Yup.object().shape({
  membership: membershipValidationSchema,
  profile: profileValidationSchema,
})

type StepProps = {
  step: number
  values: FormikValues
  errors: FormikErrors<FormikValues>
  touched: FormikTouched<FormikValues>
}

const RenderStep: React.FC<StepProps> = ({ step, values, errors, touched }) => {
  switch (step) {
    case 0:
      return <IntroStep />
    case 1:
      return <ProfileFormContent prefix='profile.' />
    case 2:
      return <MembershipStep prefix='membership.' />
    default:
      return <FinalStep />
  }
}

const errorsOnCurrentPage = (step: number, errors: FormikErrors<FormikValues>) => {
  switch (step) {
    case 0:
      return false
    case 1:
      return !!errors.profile
    case 2:
      return !!errors.membership
    default:
      return false
  }
}

export const MembershipWizard: React.FC<MembershipWizardProps> = ({ open, onClose, profile, initialValues }) => {
  const { isAuthenticated, user } = useAuth()
  const { userId } = useUser()
  const [updateUser] = useUpdateUserMutation()
  const [notify] = useNotification()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = ['Registration', 'Member Information', 'Attendance', 'Payment']
  const createOrUpdateMembership = useEditMembership(onClose)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep))
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep))
  }

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const updateProfileValues = async (profileValues: ProfileType) => {
    await updateUser({
      variables: {
        input: {
          id: profile.id!,
          patch: {
            firstName: profileValues.firstName,
            lastName: profileValues.lastName,
            fullName: profileValues.fullName,
            email: profileValues.email,
            snailMailAddress: profileValues.snailMailAddress,
            phoneNumber: profileValues.phoneNumber,
          },
        },
      },
    }).catch((error) => {
      notify({ text: error.message, variant: 'error' })
    })
  }

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const { membership: membershipValues, profile: profileValues } = values
    membershipValues.slotsAttending = toSlotsAttending(membershipValues)
    await updateProfileValues(profileValues).then(
      async () => await createOrUpdateMembership(membershipValues, profileValues)
    )
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(userId!)
    const _values = {
      membership: initialValues ? { ...initialValues } : { ...defaultValues },
      profile: { ...profile },
    }
    _values.membership.slotsAttendingData = fromSlotsAttending(_values.membership)
    return _values
  }, [initialValues, profile, userId])

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {}
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>

      <Formik initialValues={values} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogClose onClose={onClose} />
            <RenderStep step={activeStep} values={values} errors={errors} touched={touched} />
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button onClick={handleBack} variant='outlined' disabled={activeStep === 0}>
                Back
              </Button>
              {/*
                  Note that this seems like a hack, but I can't stop formik submitting my form the
                  minute I add a submit button to the page
                  and simply doing things manually appears to work
               */}
              <Button
                onClick={activeStep === steps.length - 1 ? submitForm : handleNext}
                variant='contained'
                color='primary'
                disabled={isSubmitting || errorsOnCurrentPage(activeStep, errors)}
              >
                {activeStep === steps.length - 1 ? 'Save' : 'Next'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
