import { CardContent, DialogContentText, useTheme } from '@material-ui/core'
import React from 'react'

import { HasPermission, Perms } from './Auth'
import { Card } from './Card'

export const AdminCard: React.FC<{ permission: Perms }> = ({ permission, children }) => {
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
