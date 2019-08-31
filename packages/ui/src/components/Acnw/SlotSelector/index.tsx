import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import customTabsStyle from 'assets/jss/material-kit-react/components/customTabsStyle'
import cx from 'classnames'
import { WithGameFilter, withGameFilter } from 'client/resolvers/gameFilter'
import Card from 'components/MaterialKitReact/Card/Card'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { compose } from 'recompose'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...customTabsStyle,
    cardHeader: {
      flex: 1,
      display: 'flex',
      alignItems: 'center'
    },
    slotLabel: {
      fontSize: '1.125rem',
      [theme.breakpoints.up('sm')]: {
        paddingRight: 20
      }
    },
    slot: {
      marginBottom: 55
    },
    small: {
      marginTop: 35,
      marginRight: 5,
      marginLeft: 5,
      marginBottom: 10,
      width: '95%',
      '& $tabsRoot': {
        paddingLeft: 3
      },
      '& $cardHeader': {
        padding: 0
      },
      '& $tabRootButton': {
        padding: '8px 9px'
      },
      '& $slot': {
        marginBottom: 10,
        marginTop: -16
      },
      '& h4': {
        fontSize: '1em',
        lineHeight: '1.2em',
        paddingLeft: '16px'
      }
    }
  })
)

interface SlotSelector {
  year: number
  slots: (GetSlots_slots_nodes | null)[] | undefined
  selectedSlotId: number
  small: boolean
  children(slot: GetSlots_slots_nodes): React.ReactNode
}

interface SlotSelectorInternal extends SlotSelector, WithGameFilter {}

const _SlotSelector: React.FC<SlotSelectorInternal> = props => {
  const classes = useStyles()
  const {
    slots,
    updateGameFilterMutation,
    selectedSlotId,
    year,
    small,
    children,
    gameFilter: {
      slot: { id: slotId }
    }
  } = props
  const tabsRef = React.createRef<HTMLDivElement>()
  const [scrollButtons, setScrollButtons] = useState<'off' | 'on'>('off')

  const getSlot = (slots: (GetSlots_slots_nodes | null)[], selectedSlotId: number) => {
    return slots.find(s => (s ? s.id === selectedSlotId : false)) as GetSlots_slots_nodes
  }

  const updateScrollButtons = useCallback(() => {
    const container = tabsRef.current
    if (!container || small) {
      return
    }
    const containerStyles = getComputedStyle(container.children[0])
    const containerWidth =
      container.clientWidth - (parseInt(containerStyles.paddingLeft!) + parseInt(containerStyles.paddingRight!))
    const tabs = Array.from(container.getElementsByTagName('button'))
    const items = container.querySelector('#slotLabel')
    if (items) tabs.push(items as HTMLButtonElement)
    const tabWidth = tabs.reduce((a, b) => a + b.clientWidth + parseInt(getComputedStyle(b).marginLeft!), 0)
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

  useEffect(() => {
    const slot = getSlot(slots!, selectedSlotId)
    updateGameFilterMutation({ variables: { slot, year } })
  }, [selectedSlotId, slots, updateGameFilterMutation, year])

  const handleChange = useCallback(
    (event: ChangeEvent<{}>, value: any) => {
      const slot = getSlot(slots!, value + 1)
      updateGameFilterMutation({ variables: { slot, year } })
    },
    [updateGameFilterMutation, year, slots]
  )

  if (!slots) return null

  const slot = getSlot(slots, slotId)

  return (
    <div className={cx({ [classes.small]: small })}>
      <Card>
        <div ref={tabsRef}>
          <CardHeader color='success' className={classes.cardHeader} plain>
            {!small && (
              <span id='slotLabel' className={classes.slotLabel}>
                Slot
              </span>
            )}
            <Tabs
              value={slotId - 1}
              onChange={handleChange}
              variant='scrollable'
              scrollButtons={scrollButtons}
              classes={{
                root: classes.tabsRoot,
                indicator: classes.displayNone
              }}
            >
              {slots.map(slot => {
                return slot ? (
                  <Tab
                    classes={{
                      root: classes.tabRootButton,
                      selected: classes.tabSelected,
                      wrapper: classes.tabWrapper
                    }}
                    key={slot.id}
                    label={slot.id}
                  />
                ) : null
              })}
            </Tabs>
          </CardHeader>
        </div>
      </Card>
      <h4 className={classes.slot}>
        {slot.day}, {slot.time}
      </h4>
      {children && children(slot)}
    </div>
  )
}

export const SlotSelector = compose<SlotSelectorInternal, SlotSelector>(withGameFilter)(_SlotSelector)
