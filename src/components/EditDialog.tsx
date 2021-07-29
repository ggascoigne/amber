import { Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from '@material-ui/core'
import { Form, Formik, FormikHelpers } from 'formik'
import { FormikProps } from 'formik/dist/types'
import React, { ReactElement, ReactNode, useCallback } from 'react'

import { onCloseHandler } from '../utils'
import { useAuth } from './Auth'
import { DialogTitle } from './Dialog'

export interface EditDialogProps<T> {
  title: string
  initialValues: T
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<void>
  open: boolean
  onClose: onCloseHandler
  validationSchema: any
  isEditing: boolean
  children?: ((props: FormikProps<T>) => ReactNode) | ReactNode
}

export const useDisableBackdropClick = (onClose?: onCloseHandler) =>
  useCallback(
    (event: unknown, reason: string) => {
      if (reason !== 'backdropClick') {
        onClose?.()
      }
    },
    [onClose]
  )

export function EditDialog<T>(props: EditDialogProps<T>): ReactElement {
  const { children, initialValues, onSubmit, open, onClose, title, validationSchema, isEditing } = props

  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const handleClose = useDisableBackdropClick(onClose)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Dialog fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={handleClose}>
      <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formikProps) => {
          const { isSubmitting } = formikProps
          return (
            <Form>
              <DialogTitle onClose={onClose}>
                {isEditing ? 'Edit' : 'Add'} {title}
              </DialogTitle>
              <DialogContent>{typeof children === 'function' ? children?.(formikProps) : children}</DialogContent>
              <DialogActions className='modalFooterButtons'>
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
