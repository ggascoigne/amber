import { ReactNode } from 'react'

import Box from '@mui/material/Box'
import FormLabel from '@mui/material/FormLabel'

type OutlinedBoxProps = {
  label: string | null
  children: ReactNode
}

export const OutlinedBox: React.FC<OutlinedBoxProps> = (props) => {
  const { label, children } = props
  return (
    <Box
      sx={{
        pt: 2,
      }}
    >
      <FormLabel
        sx={{
          marginLeft: '0.71em',
          marginTop: '-0.71em',
          paddingLeft: '0.44em',
          paddingRight: '0.44em',
          zIndex: 2,
          backgroundColor: 'background.paper',
          position: 'absolute',
          width: 'auto',
          color: 'inherit',
        }}
      >
        {label}
      </FormLabel>
      <Box
        sx={{
          position: 'relative',
          borderRadius: (theme) => `${theme.shape.borderRadius}px`,
          fontSize: '0.875rem',
          border: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.23)',
          padding: 1,
          pt: 0,
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
