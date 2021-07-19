import { DialogContentText, createStyles, makeStyles } from '@material-ui/core'
import { UserInput } from 'client'
import { TextField } from 'components/Form'
import React from 'react'

import { ObjectOf } from '../../utils'
import { HasPermission, Perms, useAuth } from '../Auth'
import { GridContainer, GridItem } from '../Grid'
import { Important } from '../Typography'

export type ProfileType = ObjectOf<UserInput>

const useStyles = makeStyles(() =>
  createStyles({
    important: {
      marginBottom: 12,
    },
  })
)

interface ProfileFormContentProps {
  prefix?: string
}

export const ProfileFormContent: React.FC<ProfileFormContentProps> = ({ prefix = '' }) => {
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const classes = useStyles({})
  return (
    <>
      <DialogContentText>
        Please ensure that this information is up to date. We promise we wont spam you.
      </DialogContentText>
      <HasPermission permission={Perms.IsAdmin}>
        <Important className={classes.important}>Admin Mode</Important>
      </HasPermission>
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}email`} label='Email Address' fullWidth required disabled={!isAdmin} />
        </GridItem>
        <GridItem container spacing={2} xs={12} md={12} direction='row' style={{ paddingRight: 0 }}>
          <GridItem xs={6} md={6}>
            <TextField name={`${prefix}firstName`} label='First Name' fullWidth required autoFocus />
          </GridItem>
          <GridItem xs={6} md={6} style={{ paddingRight: 0 }}>
            <TextField name={`${prefix}lastName`} label='Last Name' fullWidth required />
          </GridItem>
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}fullName`} label='Full Name' fullWidth required />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}snailMailAddress`} label='Address' fullWidth required multiline />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}phoneNumber`} label='Phone number' fullWidth required />
        </GridItem>
      </GridContainer>
    </>
  )
}
