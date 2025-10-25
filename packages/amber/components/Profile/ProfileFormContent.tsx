import type React from 'react'

import { GridContainer, GridItem, Important, TextField } from '@amber/ui'
import { DialogContentText } from '@mui/material'

import { HasPermission, Perms, useAuth } from '../Auth'

interface ProfileFormContentProps {
  prefix?: string
}

export const ProfileFormContent: React.FC<ProfileFormContentProps> = ({ prefix = '' }) => {
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  return (
    <div>
      <DialogContentText>
        Please ensure that this information is up to date. We promise we wont spam you.
      </DialogContentText>
      <HasPermission permission={Perms.IsAdmin}>
        <Important sx={{ mb: '12px' }}>Admin Mode</Important>
      </HasPermission>
      <GridContainer spacing={2} direction='column'>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}email`} label='Email Address' fullWidth required disabled={!isAdmin} />
        </GridItem>
        <GridItem container spacing={2} size={{ xs: 12, md: 12 }} style={{ marginLeft: 0, paddingRight: 0 }}>
          <GridItem size={{ xs: 6, md: 6 }} style={{ paddingLeft: 0, paddingRight: 8 }}>
            <TextField name={`${prefix}firstName`} label='First Name' fullWidth required autoFocus />
          </GridItem>
          <GridItem size={{ xs: 6, md: 6 }} style={{ paddingLeft: 8, paddingRight: 0 }}>
            <TextField name={`${prefix}lastName`} label='Last Name' fullWidth required />
          </GridItem>
        </GridItem>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}fullName`} label='Full Name' fullWidth required />
        </GridItem>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}displayName`} label='Display Name' fullWidth />
        </GridItem>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}profile[0].snailMailAddress`} label='Address' fullWidth required multiline />
        </GridItem>
        <GridItem size={{ xs: 12, md: 12 }}>
          <TextField name={`${prefix}profile[0].phoneNumber`} label='Phone number' fullWidth required />
        </GridItem>
      </GridContainer>
    </div>
  )
}
