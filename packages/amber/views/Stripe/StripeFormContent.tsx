import React, { Suspense } from 'react'

import { useFormikContext } from 'formik'
import { GridContainer, GridItem, Loader } from 'ui'

interface StripeFormContentProps {
  prefix?: string
}

const ReactJson = React.lazy(() => import('@microlink/react-json-view'))

export const StripeFormContent: React.FC<StripeFormContentProps> = () => {
  const { values } = useFormikContext<any>()
  return (
    <GridContainer spacing={2} direction='column' sx={{ pt: 2 }}>
      <GridItem xs={12} md={12}>
        <Suspense fallback={<Loader />}>
          <ReactJson src={{ ...values.data }} collapsed={1} indentWidth={2} enableClipboard={false} sortKeys />
        </Suspense>
      </GridItem>
    </GridContainer>
  )
}
