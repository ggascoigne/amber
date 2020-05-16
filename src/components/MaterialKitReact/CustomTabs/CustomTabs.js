import Icon from '@material-ui/core/Icon'
// material-ui components
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import styles from 'assets/jss/material-kit-react/components/customTabsStyle'
// nodejs library that concatenates classes
import classNames from 'classnames'
// core components
import Card from 'components/Card/Card'
import CardBody from 'components/Card/CardBody'
import CardHeader from 'components/Card/CardHeader'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'

const useStyles = makeStyles(styles)

export default function CustomTabs(props) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, value) => {
    setValue(value)
  }
  const classes = useStyles()
  const { headerColor, plainTabs, tabs, title, rtlActive } = props
  const cardTitle = classNames({
    [classes.cardTitle]: true,
    [classes.cardTitleRTL]: rtlActive,
  })
  return (
    <Card plain={plainTabs}>
      <CardHeader color={headerColor} plain={plainTabs}>
        {title !== undefined ? <div className={cardTitle}>{title}</div> : null}
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.tabsRoot,
            indicator: classes.displayNone,
          }}
        >
          {tabs.map((prop, key) => {
            let icon = {}
            if (prop.tabIcon) {
              icon = {
                icon: typeof prop.tabIcon === 'string' ? <Icon>{prop.tabIcon}</Icon> : <prop.tabIcon />,
              }
            }
            return (
              <Tab
                classes={{
                  root: classes.tabRootButton,
                  label: classes.tabLabel,
                  selected: classes.tabSelected,
                  wrapper: classes.tabWrapper,
                }}
                key={key}
                label={prop.tabName}
                {...icon}
              />
            )
          })}
        </Tabs>
      </CardHeader>
      <CardBody>
        {tabs.map((prop, key) => {
          if (key === value) {
            return <div key={key}>{prop.tabContent}</div>
          }
          return null
        })}
      </CardBody>
    </Card>
  )
}

CustomTabs.propTypes = {
  headerColor: PropTypes.oneOf(['warning', 'success', 'danger', 'info', 'primary', 'rose']),
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabName: PropTypes.string.isRequired,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node.isRequired,
    })
  ),
  rtlActive: PropTypes.bool,
  plainTabs: PropTypes.bool,
}
