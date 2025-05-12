import { useTRPC } from '@amber/client'
import { Button, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import Router from 'next/router'

import { formatAmountForDisplay, useUser } from '../utils'

const BalanceInner: React.FC<{ userId: number }> = ({ userId }) => {
  const trpc = useTRPC()
  const data = useQuery(trpc.users.getUser.queryOptions({ id: userId }))
  const balance = data?.data?.balance

  if (!balance) return null

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
            color: balance !== undefined && balance < 0 ? 'error.main' : 'success.main',
          }}
        >
          {formatAmountForDisplay(balance ?? 0)}
        </Typography>
      </Box>
    </Button>
  )
}

export const Balance = () => {
  const user = useUser()
  return user?.userId ? <BalanceInner userId={user.userId} /> : null
}
