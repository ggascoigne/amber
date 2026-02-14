import Typography from '@mui/material/Typography'

import { Page } from '@/Components'

type ErrorPageProps = {
  failure: unknown
}

export const ErrorPage = ({ failure }: ErrorPageProps) => {
  // todo, verify the error type
  const error = failure as Error
  return (
    <Page>
      <Typography component='h2' sx={{ pb: 1 }}>
        Error
      </Typography>
      <Typography>{error?.message}</Typography>
      <Typography>{error?.cause as string}</Typography>
    </Page>
  )
}
