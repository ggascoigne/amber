import type { ReactElement, ReactNode } from 'react'
import { useCallback } from 'react'

import { Button, Dialog, DialogActions, DialogContent, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { FormikHelpers, FormikValues } from 'formik'
import { Form, Formik } from 'formik'
import type { FormikProps } from 'formik/dist/types'
import { useHotkeys } from 'react-hotkeys-hook'

import { DialogTitle } from './Dialog'

import type { OnCloseHandler } from '../utils'
import { formatDebugValue, isDev } from '../utils'

export interface EditDialogProps<T> {
  title: string
  initialValues: T
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<void>
  open: boolean
  onClose: OnCloseHandler
  validationSchema?: any
  isEditing?: boolean
  children?: ((props: FormikProps<T>) => ReactNode) | ReactNode
}

export const useDisableBackdropClick = (onClose?: OnCloseHandler) =>
  useCallback(
    (event: unknown, reason: string) => {
      if (reason !== 'backdropClick') {
        onClose?.()
      }
    },
    [onClose],
  )

export function EditDialog<T extends FormikValues>(props: EditDialogProps<T>): ReactElement {
  const { children, initialValues, onSubmit, open, onClose, title, validationSchema, isEditing = false } = props
  useHotkeys('Escape', onClose, { enableOnFormTags: ['INPUT', 'TEXTAREA'] })

  const handleClose = useDisableBackdropClick(onClose)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Dialog fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={handleClose}>
      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formikProps) => {
          const { isSubmitting, values, errors } = formikProps
          return (
            <Form>
              <DialogTitle onClose={onClose}>
                {isEditing ? 'Edit' : 'Add'} {title}
              </DialogTitle>
              <DialogContent>{typeof children === 'function' ? children?.(formikProps) : children}</DialogContent>
              <DialogActions className='modalFooterButtons'>
                {isDev && (
                  <Button
                    onClick={() => {
                      console.log(`values = ${formatDebugValue(values)}`)
                      console.log(`errors = ${formatDebugValue(errors)}`)
                    }}
                    variant='outlined'
                  >
                    Debug
                  </Button>
                )}
                <Button onClick={onClose} variant='outlined'>
                  Cancel
                </Button>
                <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
