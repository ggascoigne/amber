const ordinals: { [k: number]: string } = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh',
  12: 'twelfth',
  13: 'thirteenth',
  14: 'fourteenth',
  15: 'fifteenth',
  16: 'sixteenth',
  17: 'seventeenth',
  18: 'eighteenth',
  19: 'nineteenth',
  20: 'twentieth',
  30: 'thirtieth',
  40: 'fortieth',
  50: 'fiftieth',
  60: 'sixtieth',
  70: 'seventieth',
  80: 'eightieth',
  90: 'ninetieth'
}

const prefixes: { [k: number]: string } = {
  2: 'twenty',
  3: 'thirty',
  4: 'forty',
  5: 'fifty',
  6: 'sixty',
  7: 'seventy',
  8: 'eighty',
  9: 'ninety'
}

// note only good for ordinals between 1 and 99 inclusive
const getOrdinalWord = (value: number): string =>
  value < 1 || value > 99
    ? `${value}`
    : value <= 20 || value % 10 === 0
    ? ordinals[value]
    : prefixes[Math.floor(value / 10)] + '-' + ordinals[value % 10]

export default getOrdinalWord
