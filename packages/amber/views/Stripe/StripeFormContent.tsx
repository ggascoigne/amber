import type React from 'react'
import { Suspense } from 'react'

import { GridContainer, GridItem, Loader, ObjectView } from '@amber/ui'
import { useFormikContext } from 'formik'

interface StripeFormContentProps {
  prefix?: string
}

export const StripeFormContent: React.FC<StripeFormContentProps> = () => {
  const { values } = useFormikContext<any>()
  return (
    <GridContainer spacing={2} direction='column' sx={{ pt: 2 }}>
      <GridItem size={{ xs: 12, md: 12 }}>
        <Suspense fallback={<Loader />}>
          <ObjectView valueGetter={() => values.data} name='root' expandLevel={3} />
        </Suspense>
      </GridItem>
    </GridContainer>
  )
}
