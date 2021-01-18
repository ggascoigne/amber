import type { MouseEvent } from 'react'
import {
  ActionType,
  ColumnInstance,
  HeaderGroup,
  Hooks,
  Meta,
  ReducerTableState,
  TableInstance,
  TableState,
  UseResizeColumnsState,
  actions,
  defaultColumn,
  ensurePluginOrder,
  makePropGetter,
  useGetLatest,
} from 'react-table'

import { getFirstDefined } from './tableHookUtils'

// Default Column
defaultColumn.canResize = true

// Actions
actions.columnStartResizing = 'columnStartResizing'
actions.columnResizing = 'columnResizing'
actions.columnDoneResizing = 'columnDoneResizing'

export const useResizeColumns = <D extends Record<string, unknown>>(hooks: Hooks<D>): void => {
  hooks.getResizerProps = [defaultGetResizerProps]
  hooks.getHeaderProps.push({
    style: {
      position: 'relative',
    },
  })
  hooks.stateReducers.push(reducer)
  hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions)
  hooks.useInstance.push(useInstance)
}

const defaultGetResizerProps = <D extends Record<string, unknown>>(
  props: any,
  { instance, header }: Meta<D, { header: HeaderGroup<D> }>
) => {
  const { dispatch } = instance

  const onResizeStart = (e: MouseEvent<HTMLDivElement> | TouchEvent, header: HeaderGroup<D>) => {
    let isTouchEvent = false
    if (e.type === 'touchstart') {
      const te = e as TouchEvent
      // lets not respond to multiple touches (e.g. 2 or 3 fingers)
      if (te.touches.length > 1) {
        return
      }
      isTouchEvent = true
    }
    const headersToResize = getLeafHeaders(header)
    const headerIdWidths = headersToResize.map((d) => [d.id, d.totalWidth])

    const clientX = isTouchEvent ? Math.round((e as TouchEvent).touches[0].clientX) : (e as MouseEvent).clientX

    const dispatchMove = (clientXPos: number) => {
      dispatch({ type: actions.columnResizing, clientX: clientXPos })
    }
    const dispatchEnd = () => dispatch({ type: actions.columnDoneResizing })

    const handlersAndEvents = {
      mouse: {
        moveEvent: 'mousemove',
        moveHandler: (e: MouseEvent) => dispatchMove(e.clientX),
        upEvent: 'mouseup',
        upHandler: (e: MouseEvent) => {
          document.removeEventListener('mousemove', (handlersAndEvents.mouse.moveHandler as unknown) as EventListener)
          document.removeEventListener('mouseup', (handlersAndEvents.mouse.upHandler as unknown) as EventListener)
          dispatchEnd()
        },
      },
      touch: {
        moveEvent: 'touchmove',
        moveHandler: (e: TouchEvent) => {
          if (e.cancelable) {
            e.preventDefault()
            e.stopPropagation()
          }
          dispatchMove(e.touches[0].clientX)
          return false
        },
        upEvent: 'touchend',
        upHandler: (e: TouchEvent) => {
          document.removeEventListener(
            handlersAndEvents.touch.moveEvent,
            (handlersAndEvents.touch.moveHandler as unknown) as EventListener
          )
          document.removeEventListener(
            handlersAndEvents.touch.upEvent,
            (handlersAndEvents.touch.moveHandler as unknown) as EventListener
          )
          dispatchEnd()
        },
      },
    }

    const events = isTouchEvent ? handlersAndEvents.touch : handlersAndEvents.mouse
    document.addEventListener(events.moveEvent, (events.moveHandler as unknown) as EventListener, {
      passive: false,
    })
    document.addEventListener(events.upEvent, (events.upHandler as unknown) as EventListener, {
      passive: false,
    })

    dispatch({
      type: actions.columnStartResizing,
      columnId: header.id,
      columnWidth: header.totalWidth,
      headerIdWidths,
      clientX,
    })
  }

  return [
    props,
    {
      onMouseDown: (e: MouseEvent<HTMLDivElement>) => {
        e.persist()
        onResizeStart(e, header)
      },
      onTouchStart: (e: TouchEvent) => {
        onResizeStart(e, header)
      },
      style: {
        cursor: 'ew-resize',
      },
      draggable: false,
      role: 'separator',
    },
  ]
}

useResizeColumns.pluginName = 'useResizeColumns'

function reducer<D extends Record<string, unknown>>(
  previousState: TableState<D>,
  action: ActionType
): ReducerTableState<D> | undefined {
  const state: TableState<D> & UseResizeColumnsState<D> = previousState as TableState<D> & UseResizeColumnsState<D>
  if (action.type === actions.init) {
    return {
      // columnResizing: {
      //   columnWidths: {},
      // },
      ...state,
    }
  }

  if (action.type === actions.columnStartResizing) {
    const { clientX, columnId, columnWidth, headerIdWidths } = action

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: clientX,
        headerIdWidths,
        columnWidth,
        isResizingColumn: columnId,
      },
    }
  }

  if (action.type === actions.columnResizing) {
    const { clientX } = action
    const { startX, columnWidth, headerIdWidths } = state.columnResizing

    const deltaX = clientX - startX!
    const percentageDeltaX = deltaX / columnWidth

    const newColumnWidths: Record<string, number> = {}
    // @ts-ignore
    headerIdWidths.forEach(([headerId, headerWidth]) => {
      newColumnWidths[headerId] = Math.max(headerWidth + headerWidth * percentageDeltaX, 0)
    })

    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        columnWidths: {
          ...state.columnResizing.columnWidths,
          ...newColumnWidths,
        },
      },
    }
  }

  if (action.type === actions.columnDoneResizing) {
    return {
      ...state,
      columnResizing: {
        ...state.columnResizing,
        startX: undefined,
        isResizingColumn: undefined,
      },
    }
  }
}

const useInstanceBeforeDimensions = <D extends Record<string, unknown>>(instance: TableInstance<D>) => {
  const { flatHeaders, disableResizing, state, getHooks } = instance
  const { columnResizing } = state as TableState<D> & UseResizeColumnsState<D>

  const getInstance = useGetLatest(instance)

  flatHeaders.forEach((header) => {
    const canResize = getFirstDefined(
      header.disableResizing === true ? false : undefined,
      disableResizing === true ? false : undefined,
      true
    )

    header.canResize = canResize
    header.width = columnResizing.columnWidths[header.id] || header.width
    header.isResizing = columnResizing.isResizingColumn === header.id

    if (canResize) {
      header.getResizerProps = makePropGetter(getHooks().getResizerProps, {
        instance: getInstance(),
        header,
      })
    }
  })
}

function useInstance<D extends Record<string, unknown>>({ plugins }: TableInstance<D>) {
  ensurePluginOrder(plugins, ['useAbsoluteLayout'], 'useResizeColumns')
}

function getLeafHeaders<D extends Record<string, unknown>>(header: HeaderGroup<D>) {
  const leafHeaders: ColumnInstance<D>[] = []
  const recurseHeader = (header: ColumnInstance<D>) => {
    if (header.columns.length) {
      header.columns.map(recurseHeader)
    }
    leafHeaders.push(header)
  }
  recurseHeader(header)
  return leafHeaders
}
