SELECT
  n.nspname AS function_schema,
  p.proname AS function_name,
  l.lanname AS function_language,
  CASE
    WHEN l.lanname = 'internal' THEN p.prosrc
    ELSE PG_GET_FUNCTIONDEF(p.oid)
  END AS definition,
  PG_GET_FUNCTION_ARGUMENTS(p.oid) AS function_arguments,
  t.typname AS return_type
FROM
  pg_proc p
  LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
  LEFT JOIN pg_language l ON p.prolang = l.oid
  LEFT JOIN pg_type t ON t.oid = p.prorettype
WHERE
  n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY
  function_schema,
  function_name;