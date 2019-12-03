import { useCallback } from 'react'
import { Column, Hooks, TableAction, TableInstance, TableState, actions, reducerHandlers } from 'react-table'
const pluginName = 'useHideColumns'

// Actions
actions.hideColumn = 'hideColumn'

// Reducer
reducerHandlers[pluginName] = (state: TableState, action: TableAction & { key: string | number; hide: boolean }) => {
  if (action.type === actions.init) {
    return {
      hiddenColumns: [],
      ...state
    }
  }

  if (action.type === actions.hideColumn) {
    const hidden = new Set(state.hiddenColumns)
    if (action.hide) {
      hidden.add(action.key)
    } else {
      hidden.delete(action.key)
    }
    return {
      ...state,
      hiddenColumns: Array.from(hidden)
    }
  }
}

const columnsBeforeHeaderGroups = (userColumns: Column<any>[]) => {
  const columns = [...userColumns]
  columns.forEach(column => {
    const show = column.show
    column.show = (instance: TableInstance) => {
      const { hiddenColumns = [] } = instance.state
      const key = column.id || column.accessor
      const visible = typeof show === 'function' ? show(instance) : !!show
      return visible && !hiddenColumns.find(s => s === key)
    }
  })
  return columns
}

const useInstance = <T extends object>(instance: TableInstance<T>): TableInstance<T> => {
  const { dispatch } = instance
  const setColumnHidden = useCallback(
    (key: string | number, hide: boolean) => {
      return dispatch({ type: actions.hideColumn, key, hide })
    },
    [dispatch]
  )
  return {
    ...instance,
    setColumnHidden
  }
}

export const useHideColumns = <T extends object = {}>(hooks: Hooks<T>) => {
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups)
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    const { hiddenColumns } = instance.state
    return [...deps, hiddenColumns]
  })
  hooks.useInstance.push(useInstance)
}

useHideColumns.pluginName = pluginName
