import React, { ReactElement, ReactNode, useCallback, useMemo } from 'react'

import { Button, Dialog, DialogActions, DialogContent, Step, StepButton, Stepper, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Form, Formik, FormikErrors, FormikHelpers, FormikValues } from 'formik'
import Zet from 'zet'

import { DialogClose } from './Dialog'
import { useDisableBackdropClick } from './EditDialog'

import { isDev, notEmpty } from '../utils'

export interface WizardPage {
  name: string
  optional: boolean
  hasForm: boolean
  render: ReactElement
  hasErrors?: (errors: FormikErrors<FormikValues>) => boolean
  enabled?: boolean
}

const setAdd = (input: Zet<number>, value: number) => input.union(new Zet([value]))

const setDelete = (input: Zet<number>, value: number) => input.difference(new Zet([value]))

const useSteps = (steps: WizardPage[], isEditing: boolean) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState(new Zet<number>())
  const [visited, setVisited] = React.useState(new Zet<number>([0]))

  const errorsOnCurrentPage = (step: number, errors: FormikErrors<FormikValues>) => !!steps[step].hasErrors?.(errors)

  const canSave = () => {
    const allFormSteps = new Zet(
      // note that we ignore the last page here regardless of if it's a form
      steps.map((step, index) => (step.hasForm && index !== steps.length - 1 ? index : undefined)).filter(notEmpty),
    )
    const allFormStepsComplete = completed.superset(allFormSteps)
    const allStepsVisited = visited.size === steps.length
    // console.log({ allStepsVisited, allFormStepsComplete })
    return (allStepsVisited && allFormStepsComplete) || isEditing
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const newActiveStep = prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
      setVisited((previous) => setAdd(previous, newActiveStep))
      return newActiveStep
    })
  }

  const handleStep = (newStep: number, lastStepComplete: boolean) => {
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

  const getActiveStep = () => activeStep

  return {
    getActiveStep,
    canSave,
    handleBack,
    handleStep,
    handleNext,
    isStepComplete,
    errorsOnCurrentPage,
  }
}

export const SaveButtonDefault: React.FC<{
  disabled: boolean
  validateForm: (values?: any) => Promise<FormikErrors<any>>
  submitForm: (() => Promise<void>) & (() => Promise<any>)
  children: ReactNode
}> = ({ disabled, children, validateForm, submitForm }) => (
  <Button
    onClick={() =>
      validateForm().then(() => {
        submitForm()
      })
    }
    variant='contained'
    color='primary'
    disabled={disabled}
  >
    {children}
  </Button>
)

interface WizardProps<T> {
  pages: WizardPage[]
  values: T
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<void>
  onClose: (event?: any) => void
  validationSchema: any
  open: boolean
  isEditing: boolean
  SaveButton?: React.FC<{
    disabled: boolean
    validateForm: (values?: any) => Promise<FormikErrors<any>>
    submitForm: (() => Promise<void>) & (() => Promise<any>)
    children: ReactNode
  }>
}

export const Wizard = <T extends FormikValues = FormikValues>({
  pages,
  values: workingValues,
  onSubmit,
  onClose,
  validationSchema,
  open,
  isEditing,
  SaveButton = SaveButtonDefault,
}: WizardProps<T>) => {
  const activePages = useMemo(() => pages.filter(({ enabled = true }) => enabled), [pages])
  const { getActiveStep, canSave, handleBack, handleStep, handleNext, isStepComplete, errorsOnCurrentPage } = useSteps(
    activePages,
    isEditing,
  )
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))
  const handleClose = useDisableBackdropClick(onClose)

  const NextStep: React.FC<{ step: number }> = useCallback(({ step }) => activePages[step].render, [activePages])

  return (
    <Dialog fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={handleClose}>
      <Formik
        initialValues={workingValues}
        validateOnMount
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, submitForm, isSubmitting, validateForm }) => (
          <>
            {/* note that this trick ensures that we don't get a vertical scroll when all we want is the horizontal one */}
            <div style={{ overflowY: 'visible' }}>
              <Stepper
                activeStep={getActiveStep()}
                alternativeLabel
                nonLinear
                sx={{ p: 3, width: 'calc(100% - 48px)', overflowX: 'auto' }}
              >
                {activePages.map((page, index) => (
                  <Step key={page.name} completed={isStepComplete(index)}>
                    <StepButton
                      onClick={() => {
                        validateForm().then(() => {
                          handleStep(index, !errorsOnCurrentPage(getActiveStep(), errors))
                        })
                      }}
                      optional={activePages[index].optional ? `Optional` : undefined}
                    >
                      {page.name}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </div>
            <DialogClose onClose={onClose} />
            <DialogContent>
              <Form>
                <NextStep step={getActiveStep()} />
              </Form>
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              {isDev && (
                <Button
                  onClick={() => {
                    console.log(`values = ${JSON.stringify(values, null, 2)}`)
                    console.log(`errors = ${JSON.stringify(errors, null, 2)}`)
                  }}
                  variant='outlined'
                >
                  Debug
                </Button>
              )}
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button
                onClick={() => validateForm().then(() => handleBack())}
                variant='outlined'
                disabled={getActiveStep() === 0}
              >
                Back
              </Button>
              {/*
                  Note that this seems like a hack, but I can't stop formik submitting my form the
                  minute I add a submit button to the page
                  and simply doing things manually appears to work
               */}
              {canSave() ? (
                <SaveButton
                  validateForm={validateForm}
                  submitForm={submitForm}
                  disabled={isSubmitting || errorsOnCurrentPage(getActiveStep(), errors)}
                >
                  Save
                </SaveButton>
              ) : (
                <Button
                  onClick={() => validateForm().then(() => handleNext())}
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting || errorsOnCurrentPage(getActiveStep(), errors)}
                >
                  Next
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  )
}
