import PropTypes from 'prop-types'
import { defaultColumn, defaultState } from 'react-table'

//

// ggp: begin - copied form private methods in react-table
export function getFirstDefined(...args) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
}

export const mergeProps = (...groups) => {
  let props = {}
  groups.forEach(({ style = {}, className, ...rest } = {}) => {
    props = {
      ...props,
      ...rest,
      style: {
        ...(props.style || {}),
        ...style
      },
      className: [props.className, className].filter(Boolean).join(' ')
    }
  })
  return props
}

export const applyPropHooks = (hooks, ...args) => hooks.reduce((prev, next) => mergeProps(prev, next(...args)), {})
// ggp: end - copied form private methods in react-table

defaultState.columnResizing = {
  columnWidths: {}
}

defaultColumn.canResize = true

const propTypes = {}

export const useResizeColumns = hooks => {
  hooks.useBeforeDimensions.push(useBeforeDimensions)
}

useResizeColumns.pluginName = 'useResizeColumns'

const useBeforeDimensions = instance => {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useResizeColumns')

  instance.hooks.getResizerProps = []

  const {
    flatHeaders,
    disableResizing,
    hooks: { getHeaderProps },
    state: { columnResizing },
    setState
  } = instance

  getHeaderProps.push(() => {
    return {
      style: {
        position: 'relative'
      }
    }
  })

  const onMouseDown = (e, header) => {
    const headersToResize = getLeafHeaders(header)
    // ggp:  note that this is a hack and totally dependent upon the dom I've created
    const startWidths =
      headersToResize.length === 1
        ? [e.currentTarget.parentElement.offsetWidth]
        : headersToResize.map(header => header.totalWidth)
    const startX = e.clientX

    const onMouseMove = e => {
      const currentX = e.clientX
      const deltaX = currentX - startX

      const percentageDeltaX = deltaX / headersToResize.length
      // console.log(`percentageDeltaX = ${percentageDeltaX}`)

      const newColumnWidths = {}
      headersToResize.forEach((header, index) => {
        newColumnWidths[header.id] = Math.max(startWidths[index] + percentageDeltaX, 0)
      })

      setState(old => ({
        ...old,
        columnResizing: {
          ...old.columnResizing,
          columnWidths: {
            ...old.columnResizing.columnWidths,
            ...newColumnWidths
          }
        }
      }))
    }

    const onMouseUp = e => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)

      setState(old => ({
        ...old,
        columnResizing: {
          ...old.columnResizing,
          startX: null,
          isResizingColumn: null
        }
      }))
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    setState(old => ({
      ...old,
      columnResizing: {
        ...old.columnResizing,
        startX,
        isResizingColumn: header.id
      }
    }))
  }

  flatHeaders.forEach(header => {
    const canResize = getFirstDefined(
      header.disableResizing === true ? false : undefined,
      disableResizing === true ? false : undefined,
      true
    )

    header.canResize = canResize
    header.width = columnResizing.columnWidths[header.id] || header.width
    header.isResizing = columnResizing.isResizingColumn === header.id

    if (canResize) {
      header.getResizerProps = userProps => {
        return mergeProps(
          {
            onMouseDown: e => e.persist() || onMouseDown(e, header),
            style: {
              // ggp: change default cursor
              cursor: 'ew-resize'
            },
            draggable: false
          },
          applyPropHooks(instance.hooks.getResizerProps, header, instance),
          userProps
        )
      }
    }
  })

  return instance
}

function getLeafHeaders(header) {
  const leafHeaders = []
  const recurseHeader = header => {
    if (header.columns && header.columns.length) {
      header.columns.map(recurseHeader)
    }
    leafHeaders.push(header)
  }
  recurseHeader(header)
  return leafHeaders
}
