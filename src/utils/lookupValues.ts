export const getPref = (values: { value: any; text: string }[], value: string) =>
  values.find((v) => v.value === value)?.text

export const playerPreferenceOptions = [
  { value: 'any', text: 'Any' },
  { value: 'ret-only', text: 'Returning players only' },
  { value: 'ret-pref', text: 'Returning players have preference, new players welcome.' },
]

export const getPlayerPreference = (value: string) => getPref(playerPreferenceOptions, value)
