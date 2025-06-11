export const getSafeFloat = (value: string): number => {
  const floatVal = parseFloat(value)
  return isNaN(floatVal) ? 0 : floatVal
}
