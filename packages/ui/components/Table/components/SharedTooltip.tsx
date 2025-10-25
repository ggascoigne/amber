import { useMemo } from 'react'

import { useTheme } from '@mui/material/styles'
import { Tooltip } from 'react-tooltip'

export const SharedTooltip = ({ id }: { id: string }) => {
  const theme = useTheme()
  const style = useMemo(
    () =>
      ({
        colorScheme: 'dark',
        letterSpacing: '0.01071em',
        lineHeight: 1.43,
        pointerEvents: 'auto',
        boxSizing: 'inherit',
        backgroundColor: 'rgba(97, 97, 97, 0.92)',
        borderRadius: '4px',
        color: '#fff',
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing(0.5, 1),
        fontSize: '0.6875rem',
        maxWidth: '300px',
        margin: '2px',
        wordWrap: 'break-word',
        fontWeight: '500',
        transition: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 133ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        zIndex: 1500,
      }) as const,
    [theme],
  )

  return <Tooltip id={id} place='bottom' noArrow opacity={1} style={style} />
}
