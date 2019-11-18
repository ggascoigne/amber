// copied from the example in https://github.com/tannerlinsley/react-table/issues/1428
// the version in the library is deprecated and about to be deleted.

import PropTypes from 'prop-types'

function sum(arr) {
  return arr.reduce((prev, curr) => prev + curr, 0)
}

function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
  return undefined
}

function getSizesForColumn({ columns, id, width, minWidth, maxWidth }, defaultFlex) {
  if (columns) {
    columns = columns
      .filter(col => col.show || col.isVisible)
      .map(column => getSizesForColumn(column, defaultFlex))
      .filter(Boolean)

    if (!columns.length) {
      return false
    }

    const flex = sum(columns.map(col => col.flex))
    const width = sum(columns.map(col => col.width))
    const maxWidth = sum(columns.map(col => col.maxWidth))

    return {
      flex,
      width,
      maxWidth
    }
  }

  return {
    flex: width ? 0 : defaultFlex,
    width: width === 'auto' ? defaultFlex : getFirstDefined(width, minWidth, defaultFlex),
    maxWidth
  }
}

function getStylesForColumn(column, defaultFlex) {
  const { flex, width, maxWidth } = getSizesForColumn(column, defaultFlex)

  const styles = {
    flex: `${flex} 0 auto`,
    width: `${width}px`
  }
  if (maxWidth) {
    styles['maxWidth'] = `${maxWidth}px`
  }

  if (column.align && column.align === 'right') {
    styles['justifyContent'] = 'flex-end'
    styles['display'] = 'flex'
  }
  return styles
}

const propTypes = {
  defaultFlex: PropTypes.number
}

const useMain = instance => {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useFlexLayout')

  const {
    defaultFlex = 1,
    columns,
    hooks: { getRowProps, getHeaderGroupProps, getHeaderProps, getCellProps }
  } = instance

  const visibleColumns = columns.filter(column => column.visible)

  let sumWidth = 0
  visibleColumns.forEach(column => {
    const { width, minWidth } = getSizesForColumn(column, defaultFlex)
    if (width) {
      sumWidth += width
    } else if (minWidth) {
      sumWidth += minWidth
    } else {
      sumWidth += defaultFlex
    }
  })

  const rowStyles = {
    style: {
      display: 'flex',
      minWidth: `${sumWidth}px`
    }
  }

  getRowProps.push(() => rowStyles)
  getHeaderGroupProps.push(() => rowStyles)

  getHeaderProps.push(column => ({
    style: {
      boxSizing: 'border-box',
      ...getStylesForColumn(column, defaultFlex)
    }
  }))

  getCellProps.push(cell => {
    return {
      style: {
        ...getStylesForColumn(cell.column, defaultFlex)
      }
    }
  })

  return instance
}

export const useFlexLayout = hooks => {
  hooks.useMain.push(useMain)
}

useFlexLayout.pluginName = 'useFlexLayout'
