import { DialogContentText, useTheme } from '@material-ui/core'
import { UserInput } from 'client'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

import { Perms, useAuth } from '../Auth'
import { GridContainer, GridItem } from '../Grid'

export type ProfileType = UserInput

type ProfileFormContentProps = {
  prefix?: string
}

export const ProfileFormContent: React.FC<ProfileFormContentProps> = ({ prefix = '' }) => {
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const theme = useTheme()
  return (
    <>
      <DialogContentText>
        Please ensure that this information is up to date. We promise we wont spam you.
      </DialogContentText>
      {isAdmin && <DialogContentText style={{ color: theme.palette.error.main }}>Admin Mode</DialogContentText>}
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <Field
            component={TextField}
            name={`${prefix}email`}
            label='Email Address'
            fullWidth
            required
            disabled={!isAdmin}
          />
        </GridItem>
        <GridItem container spacing={2} xs={12} md={12} direction='row' style={{ paddingRight: 0 }}>
          <GridItem xs={6} md={6}>
            <Field component={TextField} name={`${prefix}firstName`} label='First Name' fullWidth required autoFocus />
          </GridItem>
          <GridItem xs={6} md={6} style={{ paddingRight: 0 }}>
            <Field component={TextField} name={`${prefix}lastName`} label='Last Name' fullWidth required />
          </GridItem>
        </GridItem>
        <GridItem xs={12} md={12}>
          <Field component={TextField} name={`${prefix}fullName`} label='Full Name' fullWidth required />
        </GridItem>
        <GridItem xs={12} md={12}>
          <Field
            component={TextField}
            name={`${prefix}snailMailAddress`}
            label='Address'
            fullWidth
            required
            multiline
          />
        </GridItem>
        <GridItem xs={12} md={12}>
          <Field component={TextField} name={`${prefix}phoneNumber`} label='Phone number' fullWidth required />
        </GridItem>
      </GridContainer>
    </>
  )
}
