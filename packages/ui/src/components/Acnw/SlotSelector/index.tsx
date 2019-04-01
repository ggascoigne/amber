import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import customTabsStyle from 'assets/jss/material-kit-react/components/customTabsStyle'
import cx from 'classnames'
import { WithGameFilter, withGameFilter } from 'client/resolvers/gameFilter'
import Card from 'components/MaterialKitReact/Card/Card'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'
import React, { ChangeEvent, Component } from 'react'
import { compose } from 'recompose'

const styles = (theme: Theme) =>
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

interface ISlotSelector {
  year: number
  slots: (GetSlots_slots_nodes | null)[]
  selectedSlotId: number
  small: boolean
  children(slot: GetSlots_slots_nodes): React.ReactNode
}

interface ISlotSelectorState {
  scrollButtons: 'off' | 'on'
}

interface ISlotSelectorInternal extends WithStyles<typeof styles>, ISlotSelector, WithGameFilter {}

class _SlotSelector extends Component<ISlotSelectorInternal, ISlotSelectorState> {
  private tabsRef = React.createRef<HTMLDivElement>()

  constructor(props: ISlotSelectorInternal) {
    super(props)
    this.state = { scrollButtons: 'off' }
  }

  componentDidUpdate() {
    this.updateScrollButtons()
  }

  componentDidMount() {
    this.updateScrollButtons()
    window.addEventListener('resize', this.updateScrollButtons.bind(this))

    const { slots, updateGameFilterMutation, selectedSlotId, year } = this.props
    const slot = this.getSlot(slots!, selectedSlotId)
    updateGameFilterMutation({ variables: { slot, year } })
  }

  private getSlot(slots: (GetSlots_slots_nodes | null)[], selectedSlotId: number) {
    return slots.find(s => (s ? s.id === selectedSlotId : false))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScrollButtons.bind(this))
  }

  updateScrollButtons() {
    const container = this.tabsRef.current
    if (!container || this.props.small) {
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
    if (this.state.scrollButtons !== newScrollButtons) {
      this.setState({
        scrollButtons: newScrollButtons
      })
    }
  }

  handleChange = (event: ChangeEvent<{}>, value: any) => {
    const { slots, updateGameFilterMutation, year } = this.props
    const slotId = value + 1
    const slot = this.getSlot(slots!, slotId)
    updateGameFilterMutation({ variables: { slot, year } })
  }

  render() {
    const {
      classes,
      slots,
      children,
      gameFilter: {
        slot: { id: slotId }
      },
      small
    } = this.props
    const slot = this.getSlot(slots, slotId)
    return (
      <div className={cx({ [classes.small]: small })}>
        <Card>
          <div ref={this.tabsRef}>
            <CardHeader ref={this.tabsRef} color='success' className={classes.cardHeader} plain>
              {!small && (
                <span id='slotLabel' className={classes.slotLabel}>
                  Slot
                </span>
              )}
              <Tabs
                value={slotId - 1}
                onChange={this.handleChange}
                variant='scrollable'
                scrollButtons={this.state.scrollButtons}
                classes={{
                  root: classes.tabsRoot,
                  indicator: classes.displayNone
                }}
              >
                {slots.map(slot => (
                  <Tab
                    classes={{
                      root: classes.tabRootButton,
                      labelContainer: classes.tabLabelContainer,
                      label: classes.tabLabel,
                      selected: classes.tabSelected,
                      wrapper: classes.tabWrapper
                    }}
                    key={slot.id}
                    label={slot.id}
                  />
                ))}
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
}

export const SlotSelector = compose<ISlotSelectorInternal, ISlotSelector>(
  withGameFilter,
  withStyles(styles, { withTheme: true })
)(_SlotSelector)
