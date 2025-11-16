import React from 'react'

import { Box } from '@mui/material'
import 'react-obj-view/dist/react-obj-view.css'

// Create a wrapper component for ObjectView that handles the lazy loading
export const ObjectView = React.lazy(() =>
  import('react-obj-view').then((module) => ({
    default: ({ valueGetter, name, expandLevel, ...props }: any) => {
      const { ObjectView: OriginalObjectView } = module
      return (
        <Box
          sx={{
            minWidth: '500px',
            '&&& .expand-symbol': {
              color: 'rgb(124, 77, 255)',
              opacity: 0.8,
            },
            '&&& .node-default': {
              letterSpacing: '0.5px',
              '> span:first-child': {
                transform: 'scaleY(2.0)',
                transformOrigin: 'center',
              },
            },
          }}
        >
          <OriginalObjectView
            valueGetter={valueGetter}
            name={name}
            expandLevel={expandLevel}
            style={{
              '--bigobjview-bg-color': 'transparent',
            }}
            lineHeight={17}
            {...props}
          />
        </Box>
      )
    },
  })),
)
