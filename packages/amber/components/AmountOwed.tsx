import { Button, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Router from 'next/router'

import { useGetUserByIdQuery } from '../client'
import { formatAmountForDisplay, useUser } from '../utils'

const AmountOwedInner: React.FC<{ userId: number }> = ({ userId }) => {
  const data = useGetUserByIdQuery({ id: userId })
  const amountOwed = data?.data?.user?.amountOwed

  if (!amountOwed) return null

  return (
    <Button
      sx={(theme: Theme) => ({
        color: 'inherit',
        position: 'relative',
        padding: '0 18px 0 0.9375rem',
        marginRight: '7px',
        textTransform: 'inherit',
        borderRadius: '3px',
        lineHeight: '20px',
        textDecoration: 'none',
        margin: '0px',
        display: 'inline-flex',
        '&:hover,&:focus': {
          color: 'inherit',
          background: 'rgba(200, 200, 200, 0.2)',
        },
        [theme.breakpoints.down('md')]: {
          width: 'calc(100% - 30px)',
          marginBottom: '8px',
          marginTop: '8px',
          textAlign: 'left',
          '& > span:first-of-type': {
            justifyContent: 'flex-start',
          },
        },
      })}
      onClick={() => Router.push('/payment')}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 180, alignItems: 'center' }}>
        <Typography>Your Balance</Typography>
        <Typography
          variant='h6'
          sx={{
            weight: 500,
            fontSize: '15px',
            color: amountOwed !== undefined && amountOwed < 0 ? 'error.main' : 'success.main',
          }}
        >
          {formatAmountForDisplay(amountOwed ?? 0)}
        </Typography>
      </Box>
    </Button>
  )
}

export const AmountOwed = () => {
  const user = useUser()
  return user?.userId ? <AmountOwedInner userId={user.userId} /> : null
}
