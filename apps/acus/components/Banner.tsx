import React from 'react'

import { Link, useConfiguration } from '@amber/amber'
import { GridContainer, GridItem } from '@amber/ui'
import { Box, SxProps, Theme } from '@mui/material'

const Logo = ({ dates, sx, virtual = false }: { dates: string; sx?: SxProps<Theme>; virtual?: boolean }) => {
  // const background = '#ffffff'
  const purple = '#31107b' // '#39177a'
  const yellow = '#ffce00'
  const virtualColor = '#ec0202'
  return (
    <Box
      component='svg'
      width='550px'
      height='139px'
      viewBox='0 0 550 139'
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      sx={sx}
    >
      <text id='acus' transform='matrix(1.0 0.0 0.0 1.0 10.0 20.0)'>
        <tspan x='1.0' y='35.0' fontFamily='Roboto' fontSize='64' fontWeight='700' textDecoration='none' fill={yellow}>
          Ambercon US
        </tspan>
      </text>
      <text id='acus-shadow' transform='matrix(1.0 0.0 0.0 1.0 8.0 18.0)'>
        <tspan x='1.0' y='35.0' fontFamily='Roboto' fontSize='64' fontWeight='700' textDecoration='none' fill={purple}>
          Ambercon US
        </tspan>
      </text>
      <text id='string' transform='matrix(1.0 0.0 0.0 1.0 6.5 73.5)'>
        <tspan x='50.0' y='30.0' fontFamily='Roboto' fontSize='34' fontWeight='700' textDecoration='none' fill={purple}>
          {dates}
        </tspan>
      </text>
      <text id='stringShadow' transform='matrix(1.0 0.0 0.0 1.0 4.0 71)'>
        <tspan x='50.0' y='30.0' fontFamily='Roboto' fontSize='34' fontWeight='700' textDecoration='none' fill={yellow}>
          {dates}
        </tspan>
      </text>
      {virtual && (
        <text
          id='virtual'
          transform='rotate(-35 50 100)
                                    translate(65 106)
                                    scale(1)'
        >
          <tspan
            x='1.0'
            y='30.0'
            fontFamily='Old Stamper'
            fontSize='38'
            fontWeight='600'
            textDecoration='none'
            fill={virtualColor}
          >
            virtual
          </tspan>
        </text>
      )}
    </Box>
  )
}

interface BannerProps {
  to?: string
}

const WrappedLogo = ({ to }: BannerProps) => {
  const configuration = useConfiguration()
  const { conventionStartDate, conventionEndDate } = configuration
  const startDay = conventionStartDate.day
  const endDay = conventionEndDate.day
  const dateRange = `${conventionStartDate.toFormat('MMMM')} ${startDay}-${endDay}, ${configuration.year}`

  const logo = (
    <Logo
      dates={dateRange}
      virtual={configuration.virtual}
      sx={{
        maxWidth: '550px',
        maxHeight: '139px',
        width: 'auto',
        height: 'auto',
        padding: '5px 5px 0px 12px',
        marginBottom: '-12px',
        boxSizing: 'content-box',
      }}
    />
  )
  return to ? <Link href={to}>{logo}</Link> : logo
}

export const Banner = ({ to }: BannerProps) => (
  <GridContainer justifyContent='center'>
    <GridItem xs={12}>
      <WrappedLogo to={to} />
    </GridItem>
  </GridContainer>
)
