export const addContext = async <T, C = any>(context: C, promise: Promise<T>) => {
  try {
    // mostly this exists to ensure that in a mass of promise results we don't have
    // to rely on the backend to tell us what the call was.
    const result = await promise
    return await Promise.resolve({ context, value: result })
  } catch (reason) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ context, value: reason })
  }
}
