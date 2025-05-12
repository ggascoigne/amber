import SuperJSON, { deserialize, parse, serialize, stringify } from 'superjson'

// // eslint-disable-next-line import/no-relative-packages
// import { Decimal } from '../generated/prisma/client/runtime/library'

// SuperJSON.registerCustom<Decimal, string>(
//   {
//     isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
//     serialize: (v) => v.toJSON(),
//     deserialize: (v) => new Decimal(v),
//   },
//   'Decimal<->number',
// )

export default SuperJSON
export { serialize, deserialize, stringify, parse }
