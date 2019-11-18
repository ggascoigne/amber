import Typography from '@material-ui/core/Typography'
import { Page } from 'components/Acnw/Page'
import React from 'react'

export const Credits = () => {
  return (
    <Page>
      <Typography variant='h3' color='inherit'>
        Credits
      </Typography>
      <div>
        Some icons made by{' '}
        <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>
          Freepik
        </a>{' '}
        from{' '}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
    </Page>
  )
}
