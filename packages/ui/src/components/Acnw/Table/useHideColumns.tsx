import { useCallback } from 'react'
import { Column, Hooks, TableInstance, TableState, actions, addActions, defaultState } from 'react-table'

addActions('hideColumn')

defaultState.hiddenColumns = []

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

const useMain = <T extends object>(instance: TableInstance<T>): TableInstance<T> => {
  const { setState } = instance
  const setColumnHidden = useCallback(
    (key: string | number, hide: boolean) => {
      setState((old): TableState<T> => {
        const hidden = new Set(old.hiddenColumns)
        if (hide) {
          hidden.add(key)
        } else {
          hidden.delete(key)
        }
        return {
          ...old,
          hiddenColumns: Array.from(hidden)
        }
      }, actions.hideColumn)
    },
    [setState]
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
  hooks.useMain.push(useMain)
}

useHideColumns.pluginName = 'useHideColumns'
