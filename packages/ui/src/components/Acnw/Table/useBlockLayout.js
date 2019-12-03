import PropTypes from 'prop-types'

const propTypes = {}

export const useBlockLayout = hooks => {
  hooks.useInstance.push(useInstance)
}

useBlockLayout.pluginName = 'useBlockLayout'

const useInstance = instance => {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useBlockLayout')

  const {
    totalColumnsWidth,
    hooks: { getRowProps, getHeaderGroupProps, getHeaderProps, getCellProps }
  } = instance

  const rowStyles = {
    style: {
      display: 'flex',
      // minWidth: `${totalColumnsWidth}px`,
      width: '100%'
    }
  }

  getRowProps.push(() => rowStyles)
  getHeaderGroupProps.push(() => rowStyles)

  const cellStyles = {
    display: 'flex',
    flex: '1 1 auto',
    boxSizing: 'border-box'
  }

  getHeaderProps.push(header => {
    return {
      style: {
        ...cellStyles,
        // minWidth: `${header.totalWidth}px`,
        width: '100%'
      }
    }
  })

  getCellProps.push(cell => {
    return {
      style: {
        ...cellStyles,
        minWidth: `${cell.column.totalWidth}px`
      }
    }
  })

  return instance
}
