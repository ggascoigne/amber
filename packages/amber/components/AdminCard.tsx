import React, { PropsWithChildren } from 'react'

import { Card } from '@amber/ui'
import { CardContent, DialogContentText } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
