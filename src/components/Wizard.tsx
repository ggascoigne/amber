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
import { Form, Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik'
import React, { ReactElement, useMemo } from 'react'
import Zet from 'zet'

import { notEmpty } from '../utils'
import { DialogClose } from './Dialog'

export interface WizardPage {
  name: string
  optional: boolean
  hasForm: boolean
  render: ReactElement
  hasErrors: (errors: FormikErrors<FormikValues>) => boolean
  enabled?: boolean
}

const setAdd = (input: Zet<number>, value: number) => input.union(new Zet([value]))

const setDelete = (input: Zet<number>, value: number) => input.difference(new Zet([value]))

const useSteps = (steps: WizardPage[]) => {
  const [activeStep, setActiveStep] = React.useState(0)
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
  const errorsOnCurrentPage = (step: number, errors: FormikErrors<FormikValues>) => steps[step].hasErrors(errors)

  return {
    activeStep,
    canSave,
    handleBack,
    handleStep,
    handleNext,
    isStepComplete,
    errorsOnCurrentPage,
  }
}

interface WizardProps<T> {
  pages: WizardPage[]
  values: T
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<void>
  onClose: (event?: any) => void
  validationSchema: any
  open: boolean
}

export const Wizard = <T extends FormikValues = FormikValues>({
  pages,
  values,
  onSubmit,
  onClose,
  validationSchema,
  open,
}: WizardProps<T>) => {
  const activePages = useMemo(() => pages.filter(({ enabled = true }) => enabled), [pages])
  const { activeStep, canSave, handleBack, handleStep, handleNext, isStepComplete, errorsOnCurrentPage } =
    useSteps(activePages)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const NextStep: React.FC<{ step: number }> = ({ step }) => activePages[step].render

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <Formik initialValues={values} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <>
            <Stepper activeStep={activeStep} alternativeLabel nonLinear>
              {activePages.map((page, index) => (
                <Step key={page.name} completed={isStepComplete(index)}>
                  <StepButton
                    onClick={handleStep(index, !errorsOnCurrentPage(activeStep, errors))}
                    completed={!errorsOnCurrentPage(index, errors) && isStepComplete(index)}
                    optional={activePages[index].optional ? `Optional` : undefined}
                  >
                    {page.name}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Form>
              <DialogClose onClose={onClose} />
              <DialogContent>
                <NextStep step={activeStep} />
              </DialogContent>
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
