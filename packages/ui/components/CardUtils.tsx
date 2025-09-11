import React, { PropsWithChildren } from 'react'

import { CardHeader } from './Card'
import { GridItem } from './Grid'

export const linkRenderer = (string: string) => {
  const linkExp = /^https?:\/\/[a-z0-9_./-]*$/i
  return (
    <>
      {string.split(/(https?:\/\/[a-z0-9_./-]*)/gi).map((part, k) => (
        <React.Fragment key={k}>
          {linkExp.exec(part) ? (
            <a
              href={part}
              onFocus={(e) => {
                e.stopPropagation()
              }}
              target='_blank'
              rel='noreferrer'
            >
              {part}
            </a>
          ) : (
            part
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export const MultiLine: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((i, key) => (
      <p key={key}>{linkRenderer(i)}</p>
    ))}
  </>
)

export const HeaderContent: React.FC<PropsWithChildren<{ name: string; tiny?: boolean }>> = ({
  name,
  tiny = false,
  children,
}) => (
  <CardHeader
    color='info'
    sx={[
      {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        ml: '15px',
        mr: '15px',
      },
      // mimic previous behavior of removing side margins on small screens
      (theme) => ({
        [theme.breakpoints.down('md')]: {
          ml: 0,
          mr: 0,
        },
      }),
    ]}
  >
    <GridItem container spacing={2} size={12} sx={{ pr: 0 }}>
      <GridItem container size={{ xs: 12, sm: children ? 7 : 12 }}>
        <h4
          style={
            tiny ? { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', margin: 0 } : { margin: 0 }
          }
        >
          {name}
        </h4>
      </GridItem>
      {children && (
        <GridItem container size={{ xs: 12, sm: 5 }}>
          {children}
        </GridItem>
      )}
    </GridItem>
  </CardHeader>
)

export const Field: React.FC<PropsWithChildren<{ label: string; small?: boolean; tiny?: boolean }>> = ({
  label,
  children,
  small,
  tiny = false,
}) => (
  <>
    <GridItem size={{ xs: 12, sm: 2 }} sx={{ pb: '10px', fontWeight: 500, minWidth: 80 }}>
      {label}
    </GridItem>
    <GridItem size={{ xs: 12, sm: small ? 4 : tiny ? 8 : 10 }} sx={{ pb: '10px' }}>
      {children}
    </GridItem>
  </>
)
