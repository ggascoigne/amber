import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { Tab, Tabs, Theme } from '@mui/material'
import { useRouter } from 'next/router'
import { makeStyles } from 'tss-react/mui'
import { Card, CardHeader, range } from 'ui'

import { getSlotDescription, SlotFormat, useConfiguration, useGameUrl } from '../../utils'
import { SlotDecorator, SlotDecoratorParams } from '../types'

const useStyles = makeStyles<void, 'tabsRoot' | 'cardHeader' | 'tabRootButton' | 'slot'>()(
  (theme: Theme, _params, classes) => ({
    card: {
      // zIndex: 200
    },
    cardTitle: {
      float: 'left',
      padding: '10px 10px 10px 0px',
      lineHeight: '24px',
    },
    cardTitleRTL: {
      float: 'right',
      padding: '10px 0px 10px 10px !important',
    },
    displayNone: {
      display: 'none !important',
    },
    tabsRoot: {
      minHeight: 'unset !important',
    },
    tabRootButton: {
      minHeight: 'unset !important',
      minWidth: 'unset !important',
      width: 'unset !important',
      height: 'unset !important',
      maxWidth: 'unset !important',
      maxHeight: 'unset !important',
      padding: '10px 15px',
      borderRadius: '3px',
      lineHeight: '24px',
      border: '0 !important',
      color: '#fff !important',
      opacity: 1,
      marginLeft: '4px',
      fontWeight: 500,
      fontSize: '12px',
      '&:last-child': {
        marginLeft: '0px',
      },
    },
    tabSelected: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transition: '0.2s background-color 0.1s',
    },
    tabWrapper: {
      display: 'inline-block',
      minHeight: 'unset !important',
      minWidth: 'unset !important',
      width: 'unset !important',
      height: 'unset !important',
      maxWidth: 'unset !important',
      maxHeight: 'unset !important',
      '& > svg': {
        verticalAlign: 'middle',
        margin: '-1.55px 5px 0 0 !important',
      },
      '&,& *': {
        letterSpacing: 'normal !important',
      },
    },
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
      [`& .${classes.tabsRoot}`]: {
        paddingLeft: 3,
      },
      [`& .${classes.cardHeader}`]: {
        padding: 0,
      },
      [`& .${classes.tabRootButton}`]: {
        padding: '8px 9px',
      },
      [`& .${classes.slot}`]: {
        marginBottom: 10,
        marginTop: -16,
      },
      '& h4': {
        fontSize: '1em',
        lineHeight: '1.2em',
        paddingLeft: '16px',
      },
    },
  }),
)

interface SlotSelectorProps {
  small: boolean
  name?: string
  decorator?: (props: SlotDecorator) => React.ReactNode
  decoratorParams?: SlotDecoratorParams

  children: ({ slot, year }: { slot: number; year: number }) => React.ReactNode
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ small, children, decorator, decoratorParams = {} }) => {
  const configuration = useConfiguration()
  const { classes, cx } = useStyles()
  const tabsRef = React.createRef<HTMLDivElement>()
  const [scrollButtons, setScrollButtons] = useState<'off' | 'on'>('off')
  const router = useRouter()
  const { base, year, slot } = useGameUrl()

  const updateScrollButtons = useCallback(() => {
    const container = tabsRef.current
    if (!container || small) {
      return
    }
    const containerStyles = getComputedStyle(container.children[0])
    const containerWidth =
      container.clientWidth - (parseInt(containerStyles.paddingLeft, 10) + parseInt(containerStyles.paddingRight, 10))
    const tabs = Array.from(container.getElementsByTagName('button'))
    const items = container.querySelector('#slotLabel')
    if (items) {
      tabs.push(items as HTMLButtonElement)
    }
    const tabWidth = tabs.reduce((a, b) => a + b.clientWidth + parseInt(getComputedStyle(b).marginLeft, 10), 0)
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
      router.replace(`${base}/${year}/${slotId}`)
    },
    [base, router, year],
  )

  const slots = range(configuration.numberOfSlots)

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
              allowScrollButtonsMobile
              // scrollButtons={scrollButtons}
              classes={{
                root: classes.tabsRoot,
                indicator: classes.displayNone,
              }}
            >
              {slots.map((s) => (
                <Tab
                  classes={{
                    root: classes.tabRootButton,
                    selected: classes.tabSelected,
                    // wrapper: classes.tabWrapper,
                  }}
                  key={s + 1}
                  label={
                    <div className={classes.labelWrapper}>
                      {s + 1}
                      {decorator?.({ year, slot: s, ...decoratorParams })}
                    </div>
                  }
                />
              ))}
            </Tabs>
          </CardHeader>
        </div>
      </Card>
      <h4 className={classes.slot}>{getSlotDescription(configuration, { slot, year, altFormat: SlotFormat.SHORT })}</h4>
      {children({ slot, year })}
    </div>
  )
}
