import type { ColumnDef, RowData } from '../tableTypes'

type UnknownRecord = Record<string, unknown>

const isPlainObject = (v: unknown): v is UnknownRecord =>
  typeof v === 'object' && v !== null && Object.getPrototypeOf(v) === Object.prototype

const deepMergeMeta = (base: object | undefined, override: object | undefined): UnknownRecord | undefined => {
  if (!base && !override) return undefined
  if (!base) return override as UnknownRecord
  if (!override) return base as UnknownRecord
  const result: UnknownRecord = { ...base }
  for (const [k, v] of Object.entries(override)) {
    const prev = (result as UnknownRecord)[k]
    if (isPlainObject(prev) && isPlainObject(v)) {
      ;(result as UnknownRecord)[k] = deepMergeMeta(prev, v) as unknown
    } else {
      ;(result as UnknownRecord)[k] = v
    }
  }
  return result
}

type AnyColumnDef<TData extends RowData> = ColumnDef<TData, unknown>

type ApplyDefaultMetaOptions<TData extends RowData, TMeta extends object> = {
  defaultMeta: TMeta
  columns: Array<AnyColumnDef<TData>>
}

/**
 * Returns new columns where column.meta = deepMerge(defaultMeta, column.meta)
 * Works for both accessor columns and group columns (recurses into .columns).
 */
export const applyDefaultMetaToColumns = <TData extends RowData, TMeta extends object>({
  defaultMeta,
  columns,
}: ApplyDefaultMetaOptions<TData, TMeta>): Array<AnyColumnDef<TData>> => {
  const walk = (defs: Array<AnyColumnDef<TData>>): Array<AnyColumnDef<TData>> =>
    defs.map((def) => {
      const mergedMeta = deepMergeMeta(defaultMeta, def.meta)

      // group columns have a "columns" array; accessor columns don't
      const maybeChildren = 'columns' in def && Array.isArray(def.columns) ? def.columns : undefined
      if (maybeChildren) {
        return {
          ...def,
          meta: mergedMeta,
          columns: walk([...maybeChildren]),
        } as AnyColumnDef<TData>
      }
      return {
        ...def,
        meta: mergedMeta,
      } as AnyColumnDef<TData>
    })

  return walk(columns)
}
