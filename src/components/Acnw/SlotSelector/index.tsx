import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import customTabsStyle from 'assets/jss/material-kit-react/components/customTabsStyle'
import cx from 'classnames'
import Card from 'components/MaterialKitReact/Card/Card'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { SlotFormat, getSlotDescription, range, useGameUrl } from 'utils'

import { SlotDecorator, SlotDecoratorParams } from '../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      // zIndex: 200
    },
    ...customTabsStyle,
    labelWrapper: {
      position: 'relative',
    },
    cardHeader: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
    },
    slotLabel: {
      fontSize: '1.125rem',
      [theme.breakpoints.up('sm')]: {
        paddingRight: 20,
      },
    },
    slot: {
      marginBottom: 55,
    },
    small: {
      marginTop: 35,
      marginRight: 5,
      marginLeft: 5,
      marginBottom: 10,
      width: '95%',
      '& $tabsRoot': {
        paddingLeft: 3,
      },
      '& $cardHeader': {
        padding: 0,
      },
      '& $tabRootButton': {
        padding: '8px 9px',
      },
      '& $slot': {
        marginBottom: 10,
        marginTop: -16,
      },
      '& h4': {
        fontSize: '1em',
        lineHeight: '1.2em',
        paddingLeft: '16px',
      },
    },
  })
)

interface SlotSelectorProps {
  small: boolean
  name?: string
  decorator?: (props: SlotDecorator) => React.ReactNode
  decoratorParams?: SlotDecoratorParams

  children({ slot, year }: { slot: number; year: number }): React.ReactNode
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ small, children, decorator, decoratorParams = {} }) => {
  const classes = useStyles()
  const tabsRef = React.createRef<HTMLDivElement>()
  const [scrollButtons, setScrollButtons] = useState<'off' | 'on'>('off')
  const history = useHistory()
  const { base, year, slot } = useGameUrl()

  const updateScrollButtons = useCallback(() => {
    const container = tabsRef.current
    if (!container || small) {
      return
    }
    const containerStyles = getComputedStyle(container.children[0])
    const containerWidth =
      container.clientWidth - (parseInt(containerStyles.paddingLeft) + parseInt(containerStyles.paddingRight))
    const tabs = Array.from(container.getElementsByTagName('button'))
    const items = container.querySelector('#slotLabel')
    if (items) {
      tabs.push(items as HTMLButtonElement)
    }
    const tabWidth = tabs.reduce((a, b) => a + b.clientWidth + parseInt(getComputedStyle(b).marginLeft), 0)
    const newScrollButtons = tabWidth > containerWidth ? 'on' : 'off'
    if (scrollButtons !== newScrollButtons) {
      setScrollButtons(newScrollButtons)
    }
  }, [scrollButtons, small, tabsRef])

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => {
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [updateScrollButtons])

  const handleChange = useCallback(
    (event: ChangeEvent<unknown>, value: any) => {
      const slotId = value + 1
      history.replace(`${base}/${year}/${slotId}`)
    },
    [base, history, year]
  )

  const slots = range(7)

  if (year === 0) return null
  return (
    <div className={cx({ [classes.small]: small })}>
      <Card className={classes.card}>
        <div ref={tabsRef}>
          <CardHeader color='success' className={classes.cardHeader} plain>
            {!small && (
              <span id='slotLabel' className={classes.slotLabel}>
                Slot
              </span>
            )}
            <Tabs
              value={slot - 1}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons={scrollButtons}
              classes={{
                root: classes.tabsRoot,
                indicator: classes.displayNone,
              }}
            >
              {slots.map((slot) => (
                <Tab
                  classes={{
                    root: classes.tabRootButton,
                    selected: classes.tabSelected,
                    wrapper: classes.tabWrapper,
                  }}
                  key={slot + 1}
                  label={
                    <div className={classes.labelWrapper}>
                      {slot + 1}
                      {decorator?.({ year, slot, ...decoratorParams })}
                    </div>
                  }
                />
              ))}
            </Tabs>
          </CardHeader>
        </div>
      </Card>
      <h4 className={classes.slot}>{getSlotDescription({ slot, year, altFormat: SlotFormat.SHORT })}</h4>
      {children({ slot, year })}
    </div>
  )
}
