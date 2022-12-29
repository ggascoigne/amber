import { Theme } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { GridContainer, GridItem } from 'ui'
import { Link, useConfiguration } from 'amber'

const useStyles = makeStyles()((theme: Theme) => ({
  banner: {
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
    padding: '5px 5px 0px 12px',
    marginBottom: '-12px',
  },
}))

const Logo: React.FC<{ dates: string; className: string; virtual?: boolean }> = ({
  dates,
  className,
  virtual = false,
}) => {
  // const background = '#ffffff'
  const purple = '#31107b' // '#39177a'
  const red = '#ce0000'
  const yellow = '#ffce00'
  const virtualColor = '#ec0202'
  return (
    <svg
      width='550px'
      height='139px'
      viewBox='0 0 550 139'
      xmlns='http://www.w3.org/2000/svg'
      version='1.1'
      className={className}
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
    </svg>
  )
}

interface BannerProps {
  to?: string
}

const WrappedLogo: React.FC<BannerProps> = ({ to }) => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  const { conventionStartDate } = configuration
  const dateRange = `${conventionStartDate.toFormat('MMMM')} ${configuration.startDay}-${configuration.endDay}, ${
    configuration.year
  }`

  const logo = <Logo dates={dateRange} className={classes.banner} virtual={configuration.virtual} />
  return to ? <Link href={to}>{logo}</Link> : logo
}

export const Banner: React.FC<BannerProps> = ({ to }) => (
  <GridContainer justifyContent='center'>
    <GridItem xs={12}>
      <WrappedLogo to={to} />
    </GridItem>
  </GridContainer>
)