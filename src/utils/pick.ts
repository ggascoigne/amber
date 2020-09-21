// select fields from object
export function pick<T, D extends keyof T>(o: T, ...props: D[]) {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })))
}
