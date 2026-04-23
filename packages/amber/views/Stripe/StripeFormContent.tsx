import type React from 'react'
import { Suspense } from 'react'

import { Loader, ObjectView } from '@amber/ui'
import { Grid } from '@mui/material'
import { useFormikContext } from 'formik'

interface StripeFormContentProps {
  prefix?: string
}

export const StripeFormContent: React.FC<StripeFormContentProps> = () => {
  const { values } = useFormikContext<any>()
  return (
    <Grid container spacing={2} sx={{ pt: 2, flexDirection: 'column' }}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Suspense fallback={<Loader />}>
          <ObjectView valueGetter={() => values.data} name='root' expandLevel={3} />
        </Suspense>
      </Grid>
    </Grid>
  )
}
