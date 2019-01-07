import { withStyles } from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import customTabsStyle from 'assets/jss/material-kit-react/components/customTabsStyle.jsx'
import { withGameFilter } from 'client/resolvers/gameFilter'
import Card from 'components/MaterialKitReact/Card/Card'
import CardHeader from 'components/MaterialKitReact/Card/CardHeader'

import * as PropTypes from 'prop-types'
import React, { Component } from 'react'
import compose from 'recompose/compose'

const styles = theme => ({
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
  }
})

class _SlotSelector extends Component {
  state = {
    scrollButtons: 'off'
  }

  constructor(props) {
    super(props)
    this.tabsRef = React.createRef()
  }

  componentDidUpdate() {
    this.updateScrollButtons()
  }

  componentDidMount() {
    this.updateScrollButtons()
    window.addEventListener('resize', this.updateScrollButtons.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateScrollButtons.bind(this))
  }

  updateScrollButtons() {
    const container = this.tabsRef.current
    if (!container) {
      return
    }
    const containerStyles = getComputedStyle(container.children[0])
    const containerWidth =
      container.clientWidth - (parseInt(containerStyles.paddingLeft) + parseInt(containerStyles.paddingRight))
    const tabs = Array.from(container.getElementsByTagName('button'))
    tabs.push(container.querySelector('#slotLabel'))
    const tabWidth = tabs.reduce((a, b) => a + b.clientWidth + parseInt(getComputedStyle(b).marginLeft), 0)
    const newScrollButtons = tabWidth > containerWidth ? 'on' : 'off'
    if (this.state.scrollButtons !== newScrollButtons) {
      this.setState({
        scrollButtons: newScrollButtons
      })
    }
  }

  handleChange = (event, value) => {
    const { updateGameFilterMutation } = this.props
    updateGameFilterMutation({ variables: { slot: value + 1 } })
  }

  render() {
    const {
      classes,
      slots,
      children,
      gameFilter: { slot: slotId }
    } = this.props
    const slot = slots.find(s => s.id === slotId)
    return (
      <>
        <Card>
          <div ref={this.tabsRef}>
            <CardHeader ref={this.tabsRef} color='success' className={classes.cardHeader} plain>
              <span id='slotLabel' className={classes.slotLabel}>
                Slot
              </span>
              <Tabs
                value={slotId - 1}
                onChange={this.handleChange}
                scrollable
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
      </>
    )
  }
}

_SlotSelector.propTypes = {
  classes: PropTypes.any,
  className: PropTypes.any
}

export const SlotSelector = compose(
  withGameFilter,
  withStyles(styles, { withTheme: true })
)(_SlotSelector)
