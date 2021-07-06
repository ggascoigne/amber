import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Step,
  StepButton,
  Stepper,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import { Form, Formik, FormikErrors, FormikHelpers, FormikTouched, FormikValues } from 'formik'
import React, { useMemo } from 'react'
import { notEmpty, useUser } from 'utils'
import Yup from 'utils/Yup'
import Zet from 'zet'

import { useAuth } from '../../components/Auth'
import { DialogClose } from '../../components/Dialog'
import { ProfileFormContent, ProfileType, profileValidationSchema } from '../../components/Profile'
import { useEditProfile } from '../../components/Profile/profileUtils'
import { FinalStep } from './FinalStep'
import { IntroStep } from './IntroStep'
import { MembershipStepVirtual } from './MembershipStepVirtual'
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

const steps = [
  {
    name: 'Registration',
    optional: false,
    hasForm: false,
    render: <IntroStep />,
    hasErrors: (errors: FormikErrors<FormikValues>) => false,
  },
  {
    name: 'Member Information',
    optional: false,
    hasForm: true,
    render: <ProfileFormContent prefix='profile.' />,
    hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.profile,
  },
  {
    name: 'Attendance',
    optional: false,
    hasForm: true,
    render: <MembershipStepVirtual prefix='membership.' />,
    hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.membership,
  },
  {
    name: 'Payment',
    optional: false,
    hasForm: false,
    render: <FinalStep />,
    hasErrors: (errors: FormikErrors<FormikValues>) => false,
  },
]

type StepProps = {
  step: number
  values: FormikValues
  errors: FormikErrors<FormikValues>
  touched: FormikTouched<FormikValues>
}

const NextStep: React.FC<{ step: number }> = ({ step }) => steps[step].render

const RenderStep: React.FC<StepProps> = ({ step }) => (
  <DialogContent>
    <NextStep step={step} />
  </DialogContent>
)

const errorsOnCurrentPage = (step: number, errors: FormikErrors<FormikValues>) => steps[step].hasErrors(errors)

const setAdd = (input: Zet<number>, value: number) => input.union(new Zet([value]))

const setDelete = (input: Zet<number>, value: number) => input.difference(new Zet([value]))

export const MembershipWizard: React.FC<MembershipWizardProps> = ({ open, onClose, profile, initialValues }) => {
  const { isAuthenticated, user } = useAuth()
  const { userId } = useUser()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = React.useState(0)
  const createOrUpdateMembership = useEditMembership(onClose)
  const updateProfile = useEditProfile()
  const [completed, setCompleted] = React.useState(new Zet<number>())
  const [visited, setVisited] = React.useState(new Zet<number>([0]))

  const canSave = () => {
    const allFormSteps = new Zet(steps.map((step, index) => (step.hasForm ? index : undefined)).filter(notEmpty))
    const allFormStepsComplete = completed.superset(allFormSteps)
    const allStepsVisited = visited.size === steps.length
    return allStepsVisited && allFormStepsComplete
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const newActiveStep = prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
      setVisited((previous) => setAdd(previous, newActiveStep))
      return newActiveStep
    })
  }

  const handleStep = (newStep: number, lastStepComplete: boolean) => () => {
    if (lastStepComplete) {
      setCompleted((previous) => setAdd(previous, activeStep))
    } else {
      setCompleted((previous) => setDelete(previous, activeStep))
    }
    setVisited((previous) => setAdd(previous, newStep))
    setActiveStep(newStep)
  }

  const handleNext = () => {
    setCompleted((previous) => setAdd(previous, activeStep))
    if (completed.size !== steps.length) {
      const newActiveStep =
        activeStep === steps.length - 1 ? steps.findIndex((step, i) => !completed.has(i)) : activeStep + 1
      setVisited((previous) => setAdd(previous, newActiveStep))
      setActiveStep(newActiveStep)
    }
  }

  const isStepComplete = (step: number) => completed.has(step)

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.log('onSubmit')
    if (false) {
      const { membership: membershipValues, profile: profileValues } = values
      membershipValues.slotsAttending = toSlotsAttending(membershipValues)
      await updateProfile(profileValues).then(
        async () => await createOrUpdateMembership(membershipValues, profileValues)
      )
    }
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
      <Formik initialValues={values} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <>
            <Stepper activeStep={activeStep} alternativeLabel nonLinear>
              {steps.map((step, index) => (
                <Step key={step.name} completed={isStepComplete(index)}>
                  <StepButton
                    onClick={handleStep(index, !errorsOnCurrentPage(activeStep, errors))}
                    completed={!errorsOnCurrentPage(index, errors) && isStepComplete(index)}
                    optional={steps[index].optional ? `Optional` : undefined}
                  >
                    {step.name}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
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
                  onClick={canSave() ? submitForm : handleNext}
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting || errorsOnCurrentPage(activeStep, errors)}
                >
                  {canSave() ? 'Save' : 'Next'}
                </Button>
              </DialogActions>
            </Form>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
