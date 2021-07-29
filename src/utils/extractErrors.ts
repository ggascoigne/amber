export const extractErrors = <T, D extends keyof T = keyof T>(errors: T, ...props: D[]) => {
  const relevantErrors = props.reduce((result, prop) => {
    if (errors?.[prop]) result[prop] = errors[prop]
    return result
  }, {} as T)
  return !relevantErrors || Object.keys(relevantErrors).length === 0 ? undefined : relevantErrors
}
