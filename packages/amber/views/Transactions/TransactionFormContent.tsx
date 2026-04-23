import type React from 'react'

import { getSafeFloat, TextField } from '@amber/ui'
import { Grid, InputAdornment, Typography } from '@mui/material'

interface TransactionFormContentProps {
  prefix?: string
}

export const TransactionFormContent: React.FC<TransactionFormContentProps> = ({ prefix = '' }) => (
  <Grid container spacing={2} sx={{ pt: 2, flexDirection: 'column' }}>
    <Grid size={{ xs: 12, md: 12 }}>
      <Typography variant='body1'>Note that costs are negative values, and payments are positive ones.</Typography>
    </Grid>
    <Grid container spacing={2} size={{ xs: 12, md: 12 }} style={{ marginLeft: 0, paddingRight: 0 }}>
      <Grid size={{ xs: 6, md: 6 }} style={{ paddingLeft: 0, paddingRight: 8 }}>
        <TextField
          name={`${prefix}amount`}
          label='Amount'
          fullWidth
          required
          autoFocus
          parse={getSafeFloat}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position='start'>$</InputAdornment>,
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 6, md: 6 }} style={{ paddingLeft: 8, paddingRight: 0 }}>
        <TextField name={`${prefix}year`} label='year' fullWidth required />
      </Grid>
    </Grid>
    <Grid size={{ xs: 12, md: 12 }}>
      <TextField name={`${prefix}notes`} label='Notes' fullWidth multiline />
    </Grid>
    <Grid size={{ xs: 12, md: 12 }}>
      <TextField
        name={`${prefix}stringData`}
        label='Data (read-only)'
        fullWidth
        multiline
        slotProps={{
          input: {
            readOnly: true,
            sx: {
              fontFamily: 'monospace',
            },
          },
        }}
      />
    </Grid>
  </Grid>
)
