/* eslint-disable no-useless-escape */
import type { PGliteInterface } from '@electric-sql/pglite'
import { query } from '@electric-sql/pglite/template'
import debug from 'debug'

// For now, let's simplify and use regular PGlite instead of workers
// to get the basic functionality working first

const log = debug('pglite')

const USE_FTS = true

let pglite: PGliteInterface | undefined

const createTableFromJson = `
CREATE OR REPLACE FUNCTION create_table_from_json(data jsonb, table_name text) RETURNS void AS $$
DECLARE
    json_obj jsonb;
    col_name text;
    col_type text;
    col_types jsonb;
    col_def text;
    create_stmt text;
    has_id boolean := false;
BEGIN
    -- Collect column names and types
    col_types := '{}'::jsonb;

    -- Get the first object from the JSON array
    SELECT jsonb_array_elements(data)
    INTO json_obj
    LIMIT 1;

    -- Check if the JSON contains an "id" field
    has_id := json_obj ? 'id';

    -- Extract column names and infer types
    FOR col_name, col_type IN SELECT key, jsonb_typeof(value)
    FROM jsonb_each(json_obj)
    LOOP
        -- Determine the best data type
        CASE col_type
            WHEN 'boolean' THEN col_type := 'BOOLEAN';
            WHEN 'number' THEN 
                IF json_obj->>col_name ~ '^\d+$' THEN col_type := 'INTEGER'; -- Integer detection
                ELSIF json_obj->>col_name ~ '^\d+\.\d+$' THEN col_type := 'NUMERIC'; -- Decimal detection
                ELSE col_type := 'DOUBLE PRECISION';
                END IF;
            WHEN 'string' THEN
                IF json_obj->>col_name ~ '^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?' 
                THEN col_type := 'TIMESTAMP'; 
                ELSE col_type := 'TEXT';
                END IF;
            WHEN 'array' THEN col_type := 'JSONB';
            WHEN 'object' THEN col_type := 'JSONB';
            ELSE col_type := 'TEXT';
        END CASE;

        -- Store the best type found for each column
        IF NOT col_types ? col_name THEN
            col_types := jsonb_set(col_types, ARRAY[col_name], to_jsonb(col_type));
        END IF;
    END LOOP;

    -- Construct CREATE TABLE statement
    create_stmt := 'CREATE TABLE IF NOT EXISTS ' || table_name || ' (';

    -- Add "id" column if not already present
    IF NOT has_id THEN
        create_stmt := create_stmt || '"id" SERIAL PRIMARY KEY, ';
    END IF;

    -- Append other columns
    FOR col_name, col_type IN SELECT * FROM jsonb_each_text(col_types) LOOP
        col_def := '"' || col_name || '" ' || col_type;
        create_stmt := create_stmt || col_def || ', ';
    END LOOP;
    create_stmt := rtrim(create_stmt, ', ') || ');';

    -- Execute the table creation
    EXECUTE create_stmt;
END;
$$ LANGUAGE plpgsql;`

const insertJsonIntoTable = `
CREATE OR REPLACE FUNCTION insert_json_into_table(data jsonb, table_name text) RETURNS void AS $$
DECLARE
    json_obj jsonb;
    first_obj jsonb;
    col_names text[];
    col_values text[];
    col_list text;
    val_list text;
    insert_stmt text;
    col_name text;
    has_id boolean := false;
BEGIN
    -- If JSON array is empty, do nothing
    IF jsonb_array_length(data) = 0 THEN
        RAISE NOTICE 'JSON array is empty. Nothing to insert.';
        RETURN;
    END IF;

    -- Extract the first JSON object to determine column names
    SELECT jsonb_array_elements(data)
    INTO first_obj
    LIMIT 1;

    -- Check if the JSON contains an "id" field
    has_id := first_obj ? 'id';

    -- Extract column names (preserve camelCase)
    SELECT array_agg(key)
    INTO col_names
    FROM jsonb_each(first_obj);

    -- If "id" was auto-added, remove it from column list
    IF NOT has_id THEN
        col_names := array_remove(col_names, 'id');
    END IF;

    -- Construct column list for INSERT statement (wrap in double quotes to preserve camelCase)
    col_list := array_to_string(ARRAY(SELECT '"' || col || '"' FROM unnest(col_names) AS col), ', ');

    -- Loop through each JSON object and insert data
    FOR json_obj IN SELECT jsonb_array_elements(data) LOOP
        col_values := ARRAY[]::text[];

        -- Extract values for each column (preserve camelCase lookups)
        FOREACH col_name IN ARRAY col_names LOOP
            col_values := col_values || quote_nullable(json_obj->>col_name);
        END LOOP;

        -- Construct VALUES list
        val_list := array_to_string(col_values, ', ');

        -- Construct INSERT statement
        IF has_id THEN
            insert_stmt := 'INSERT INTO ' || table_name || ' (' || col_list || ') VALUES (' || val_list || ');';
        ELSE
            insert_stmt := 'INSERT INTO ' || table_name || ' (' || col_list || ') VALUES (' || val_list || ') RETURNING "id";';
        END IF;

        -- Execute the INSERT statement
        EXECUTE insert_stmt;
    END LOOP;
END;
$$ LANGUAGE plpgsql;`

export const getDatabase = async (instance = 'default') => {
  if (!pglite) {
    log('initializing PGlite', instance)
    // For now, use regular PGlite (non-worker) to get things working
    const { PGlite } = await import('@electric-sql/pglite')
    pglite = new PGlite('idb://pglite-ui-test-db')

    log('PGlite initialized')
    const versionResponse = await pglite.sql<{
      version?: string
    }>`select version()`
    const pgliteVersion = versionResponse.rows[0].version
    log(pgliteVersion)
    await pglite.exec(createTableFromJson)
    await pglite.exec(insertJsonIntoTable)
    log('PGlite functions created')
  }
  return pglite
}

export const getRowCount = async (db: PGliteInterface, tableName: string) => {
  const {
    rows: [{ total }],
  } = await db.query<{ total: number }>(`SELECT COUNT(*) AS total FROM ${tableName}`)
  return total
}

export const createTableFor = async <T extends Record<string, unknown>>(
  db: PGliteInterface,
  options: {
    tableName: string
    dataCount: number
    data: T[]
    getColumns?: () => (keyof T)[]
    postCreate?: (id: number) => Promise<void>
    globalFilterFields?: string[]
    fts?: boolean
  },
) => {
  const {
    tableName,
    data,
    dataCount,
    // fts = USE_FTS,
  } = options
  let lastQuery
  try {
    console.time(`creating ${tableName}`)
    lastQuery = query`SELECT create_table_from_json(${data}::jsonb, ${tableName});`
    await db.query(lastQuery.query, lastQuery.params)
    // log(lastQuery.query, lastQuery.params);

    const total = await getRowCount(db, tableName)
    if (total !== dataCount) {
      await db.query(`DROP table ${tableName}`)
      lastQuery = query`SELECT create_table_from_json(${data}::jsonb, ${tableName});`
      await db.query(lastQuery.query, lastQuery.params)

      lastQuery = query`SELECT insert_json_into_table(${data}::jsonb, ${tableName});`
      await db.query(lastQuery.query, lastQuery.params)
      // log(lastQuery.query, lastQuery.params);

      const newTotal = await getRowCount(db, tableName)
      log('created table "%s" with %d rows:', tableName, newTotal)
      console.timeEnd(`creating ${tableName}`)
    } else {
      log(`Reusing Table ${tableName}`)
    }
  } catch (error) {
    if (lastQuery) log(lastQuery.query, lastQuery.params)
    console.error(error)
  }
}

type SortOption = { id: string; desc: boolean }

export type FilterOptions = { id: string; value?: any; operator?: string }

type FetchDataOptions =
  | {
      pageIndex: number
      pageSize: number
      sorting: SortOption[]
      globalFilter: string
      filters?: FilterOptions[]
    }
  | {
      pageIndex?: undefined
      pageSize?: undefined
      sorting?: undefined
      globalFilter?: undefined
      filters?: undefined
    }

type SchemaOptions = {
  tableName: string
  fts?: boolean
  getJoins?: () => string | undefined
  getAdditionalFields?: () => string[]
  getWhere?: () => string | undefined
  globalFilterFields?: string[]
}

const quote = (s: string) =>
  s
    .split('.')
    .map((sub) => `"${sub}"`)
    .join('.')

const getSortString = (fts: boolean) => (s: SortOption) =>
  `${fts && s.id === 'id' ? 'rowid' : quote(s.id)} ${s.desc ? 'DESC' : 'ASC'}`

const getFilterOperator = (f: FilterOptions): string => {
  if (f?.operator && f.operator !== '') {
    return f.operator
  }

  const { value } = f

  if (Array.isArray(value)) {
    return 'IN'
  }
  if (typeof value === 'string' && value !== 'true' && value !== 'false') {
    return 'LIKE'
  }
  return '='
}

const getFilterString = (f: FilterOptions): string => {
  const operator = getFilterOperator(f)
  const { value } = f

  if (Array.isArray(value)) {
    return `${quote(f.id)} ${operator} (${value.map((v) => `'${v}'`).join(', ')})`
  }
  if (f.value?.start && f.value.end) {
    return `${quote(f.id)} BETWEEN ${f.value.start} AND ${f.value.end}`
  }
  if (value === 'true') {
    return `${quote(f.id)} ${operator} true`
  }
  if (value === 'false') {
    return `${quote(f.id)} ${operator} false`
  }
  if (typeof value === 'string') {
    if (operator === 'LIKE') {
      return `${quote(f.id)} ${operator} '%${value}%'`
    }
    return `${quote(f.id)} ${operator} '${value}'`
  }
  return `${quote(f.id)} ${operator} ${value}`
}

export const fetchSingleItem = async (db: PGliteInterface, queryString: string): Promise<any> => {
  try {
    const result = await db.query(queryString)
    return result?.rows[0]
  } catch (error) {
    console.warn('sqlTools:error', { error, query: queryString })
    throw new Error('SQLite error', {
      cause: { error, lastQuery: queryString },
    })
  }
}

export const fetchArrayData = async (
  db: PGliteInterface,
  nameOrSchemaOptions: SchemaOptions | string,
  opts?: FetchDataOptions,
) => {
  const schemaOptions =
    typeof nameOrSchemaOptions === 'string' ? { tableName: nameOrSchemaOptions } : nameOrSchemaOptions
  const { tableName, fts = USE_FTS, getJoins, getAdditionalFields, globalFilterFields } = schemaOptions
  const { pageIndex, pageSize, sorting, globalFilter, filters } = opts ?? {
    pageIndex: undefined,
    pageSize: undefined,
    sorting: undefined,
    globalFilter: undefined,
  }

  let lastQuery
  try {
    // Simulate some network latency

    // await new Promise((r) => setTimeout(r, pageIndex === 0 ? 1000 : 500));

    const clauses = []

    if (globalFilter?.length) {
      if (!fts && !globalFilterFields) {
        // matches depends on creating an FTS table
        throw new Error(
          'SqlTools error - globalFilter only supported on FTS tables or with specific fields listed in `getAdditionalFields`',
        )
      }
      if (fts) {
        clauses.push(`${tableName} MATCH '${globalFilter}'`)
      } else {
        clauses.push(globalFilterFields?.map((f) => `${quote(f)} ILIKE '%${globalFilter}%'`).join(' OR '))
      }
    }
    // get filter operators hereish...
    const activeFilters = filters?.filter((f) => f.value && f.value !== '')
    if (activeFilters?.length) {
      clauses.push(...activeFilters.map(getFilterString))
    }
    const additionalFields = getAdditionalFields?.() ?? []
    const selectClause = [`${tableName}.*`, ...additionalFields].join(', ')
    const whereClause = clauses.length ? ` WHERE ${clauses.join(' AND ')}` : ''

    const orderBy = sorting ? sorting.map(getSortString(fts)).join(', ') : ''
    const orderByFragment = orderBy ? ` ORDER BY ${orderBy}` : ''

    const joinFragment = getJoins?.() ?? ''
    const selectionFragment = `${joinFragment}${whereClause}${orderByFragment}`
    const paginationFragment = pageSize ? ` LIMIT ${pageSize} OFFSET ${pageIndex! * pageSize!}` : ''

    // fts doesn't really have an id column, but there's an internal "hidden" rowid field that serves the same purpose.
    lastQuery = fts
      ? `SELECT ${tableName}.rowid AS id, * FROM ${tableName}${selectionFragment}${paginationFragment};`
      : `SELECT ${selectClause} FROM ${tableName}${selectionFragment}${paginationFragment};`

    log('query:', lastQuery)
    const result = await db.query(lastQuery)
    const { rows } = await db.query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM ${tableName}${joinFragment}${whereClause}`,
    )
    const { total } = rows[0]
    log('fetchArrayDataPg:', { rows: result.rows, total })
    return {
      rows: result.rows,
      rowCount: total,
    }
  } catch (error) {
    console.warn('error', { tableName, error, lastQuery })
    throw new Error('pglite error', { cause: { tableName, error, lastQuery } })
  }
}
