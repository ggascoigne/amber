import type { ReactNode } from 'react'

import { Box, Typography } from '@mui/material'

type MemberSubmissionDetailLayoutProps = {
  children: ReactNode
  submissionMessage?: string | null
}

export const MemberSubmissionDetailLayout = ({ children, submissionMessage }: MemberSubmissionDetailLayoutProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      alignItems: 'stretch',
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    <Box
      sx={{
        width: { xs: '100%', md: 260 },
        flexShrink: 0,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography variant='subtitle2' component='h3'>
        Signup Notes
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {submissionMessage ?? 'No submission message.'}
      </Typography>
    </Box>
  </Box>
)
