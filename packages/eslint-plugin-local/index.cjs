const jsxNoLogicalExpression = require('./jsx-no-logical-expression.cjs')
const noPromiseAll = require('./no-promise-all.cjs')

const RULES = {
  jsxNoLogicalExpression: 'jsx-no-logical-expression',
  noPromiseAll: 'no-promise-all',
}

const rules = {
  [`local/${RULES.jsxNoLogicalExpression}`]: jsxNoLogicalExpression,
  [`local/${RULES.noPromiseAll}`]: noPromiseAll,
}

const configs = {}

module.exports = { rules, configs }
