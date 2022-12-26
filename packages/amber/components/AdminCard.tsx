import { CardContent, DialogContentText, useTheme } from '@mui/material'
import React, { PropsWithChildren } from 'react'

import { Card } from 'ui'
import { HasPermission, Perms } from './Auth'

export const AdminCard: React.FC<PropsWithChildren<{ permission: Perms }>> = ({ permission, children }) => {
  const theme = useTheme()

  return (
    <HasPermission permission={permission}>
      <Card>
        <CardContent>
          <DialogContentText style={{ color: theme.palette.error.main }}>Admin Mode</DialogContentText>
          {children}
        </CardContent>
      </Card>
    </HasPermission>
  )
}
