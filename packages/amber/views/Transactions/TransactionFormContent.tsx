import React from 'react'

import { getSafeFloat, GridContainer, GridItem, TextField } from '@amber/ui'
import { InputAdornment, Typography } from '@mui/material'

interface TransactionFormContentProps {
  prefix?: string
}

export const TransactionFormContent: React.FC<TransactionFormContentProps> = ({ prefix = '' }) => (
  <GridContainer spacing={2} direction='column' sx={{ pt: 2 }}>
    <GridItem xs={12} md={12}>
      <Typography variant='body1'>Note that costs are negative values, and payments are positive ones.</Typography>
    </GridItem>
    <GridItem container spacing={2} xs={12} md={12} style={{ marginLeft: 0, paddingRight: 0 }}>
      <GridItem xs={6} md={6} style={{ paddingLeft: 0, paddingRight: 8 }}>
        <TextField
          name={`${prefix}amount`}
          label='Amount'
          fullWidth
          required
          autoFocus
          parse={getSafeFloat}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
        />
      </GridItem>
      <GridItem xs={6} md={6} style={{ paddingLeft: 8, paddingRight: 0 }}>
        <TextField name={`${prefix}year`} label='year' fullWidth required />
      </GridItem>
    </GridItem>
    <GridItem xs={12} md={12}>
      <TextField name={`${prefix}notes`} label='Notes' fullWidth multiline />
    </GridItem>
    <GridItem xs={12} md={12}>
      <TextField
        name={`${prefix}stringData`}
        label='Data (read-only)'
        fullWidth
        multiline
        InputProps={{
          readOnly: true,
          sx: {
            fontFamily: 'monospace',
          },
        }}
      />
    </GridItem>
  </GridContainer>
)
