import type React from 'react'

import { Box } from '@mui/material'

interface QuoteProps {
  text: React.ReactNode
  author?: React.ReactNode
}

export const Quote: React.FC<QuoteProps> = ({ text, author }) => (
  <Box
    component='blockquote'
    sx={{
      fontWeight: 300,
      lineHeight: '1.5em',
      fontSize: '14px',
      padding: '10px 20px',
      margin: '0 0 20px',
      fontStyle: 'normal',
      borderLeft: '5px solid #eee',
    }}
  >
    <Box component='p' sx={{ m: 0, mb: '10px', fontStyle: 'italic' }}>
      {text}
    </Box>
    <Box
      component='small'
      sx={{
        display: 'block',
        fontSize: '80%',
        lineHeight: '1.42857143',
        color: '#777',
      }}
    >
      {author}
    </Box>
  </Box>
)
