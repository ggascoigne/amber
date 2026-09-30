// naming-convention-plugin.js
//
// An Oxlint JS plugin that replicates @typescript-eslint/naming-convention.
// Written against the standard ESLint-compatible API (`create(context)`),
// i.e. a plain plugin object identical in shape to an ESLint plugin. This
// variant does NOT depend on "@oxlint/plugins" and works under ESLint as-is.
//
// Configure in .oxlintrc.json:
//
//   {
//     "jsPlugins": ["./naming-convention-plugin.js"],
//     "rules": {
//       "naming-convention/naming-convention": [
//         "error",
//         { "selector": "default", "format": ["camelCase"], "leadingUnderscore": "allow" },
//         { "selector": "typeLike", "format": ["PascalCase"] },
//         { "selector": "variable", "modifiers": ["const"], "format": ["camelCase", "UPPER_CASE"] }
//       ]
//     }
//   }
//
// If publishing to npm, this variant has no runtime dependencies.
//
// ---------------------------------------------------------------------------
// SCOPE / LIMITATIONS (read this):
//
// Faithfully implemented (detectable from the AST alone):
//   selectors : variable, function, parameter, parameterProperty,
//               classProperty, objectLiteralProperty, typeProperty,
//               classMethod, objectLiteralMethod, typeMethod,
//               classicAccessor, autoAccessor, enumMember,
//               class, interface, typeAlias, enum, typeParameter, import
//               + the group selectors default / variableLike / memberLike /
//                 typeLike / method / property / accessor
//   formats   : camelCase, strictCamelCase, PascalCase, StrictPascalCase,
//               snake_case, UPPER_CASE
//   modifiers : const, readonly, static, public, private, protected, abstract,
//               override, async, exported, default, destructured,
//               requiresQuotes, namespace, global (best-effort), unused (best-effort)
//   options   : format (incl. null), custom {regex,match}, filter (string or
//               {regex,match}), leadingUnderscore, trailingUnderscore,
//               prefix, suffix, modifiers, multi-selector arrays,
//               specificity-based selection.
//
// NOT supported (require a type-checker, which JS plugins don't have):
//   - The `types` option (boolean / string / number / function / array).
//     A selector config carrying `types` is skipped, with a one-time warning.
//   - `global` and `unused` are best-effort and may differ at edge cases;
//     `unused` only works if the host exposes sourceCode.getDeclaredVariables.
// ---------------------------------------------------------------------------

/* ========================================================================== *
 * Selector bit-flags and meta (group) selectors
 * ========================================================================== */

const S = {
  variable: 1 << 0,
  function: 1 << 1,
  parameter: 1 << 2,
  parameterProperty: 1 << 3,
  classicAccessor: 1 << 4,
  enumMember: 1 << 5,
  classMethod: 1 << 6,
  objectLiteralMethod: 1 << 7,
  typeMethod: 1 << 8,
  classProperty: 1 << 9,
  objectLiteralProperty: 1 << 10,
  typeProperty: 1 << 11,
  autoAccessor: 1 << 12,
  class: 1 << 13,
  interface: 1 << 14,
  typeAlias: 1 << 15,
  enum: 1 << 16,
  typeParameter: 1 << 17,
  import: 1 << 18,
}

const GROUP_VARIABLE_LIKE = S.variable | S.function | S.parameter
const GROUP_MEMBER_LIKE =
  S.classProperty |
  S.objectLiteralProperty |
  S.typeProperty |
  S.classMethod |
  S.objectLiteralMethod |
  S.typeMethod |
  S.classicAccessor |
  S.autoAccessor |
  S.enumMember |
  S.parameterProperty
const GROUP_TYPE_LIKE = S.class | S.interface | S.typeAlias | S.enum | S.typeParameter
const GROUP_METHOD = S.classMethod | S.objectLiteralMethod | S.typeMethod
const GROUP_PROPERTY = S.classProperty | S.objectLiteralProperty | S.typeProperty
const GROUP_ACCESSOR = S.classicAccessor | S.autoAccessor
const META_DEFAULT = -1 // matches everything

const META = {
  default: META_DEFAULT,
  variableLike: GROUP_VARIABLE_LIKE,
  memberLike: GROUP_MEMBER_LIKE,
  typeLike: GROUP_TYPE_LIKE,
  method: GROUP_METHOD,
  property: GROUP_PROPERTY,
  accessor: GROUP_ACCESSOR,
}

const SELECTOR_LABELS = {
  variable: 'Variable',
  function: 'Function',
  parameter: 'Parameter',
  parameterProperty: 'Parameter Property',
  classicAccessor: 'Accessor',
  autoAccessor: 'Accessor',
  enumMember: 'Enum Member',
  classMethod: 'Class Method',
  objectLiteralMethod: 'Object Literal Method',
  typeMethod: 'Type Method',
  classProperty: 'Class Property',
  objectLiteralProperty: 'Object Literal Property',
  typeProperty: 'Type Property',
  class: 'Class',
  interface: 'Interface',
  typeAlias: 'Type Alias',
  enum: 'Enum',
  typeParameter: 'Type Parameter',
  import: 'Import',
  // group labels (only used if a group config is the matched one)
  default: 'Identifier',
  variableLike: 'Variable',
  memberLike: 'Member',
  typeLike: 'Type',
  method: 'Method',
  property: 'Property',
  accessor: 'Accessor',
}

function popcount(n) {
  // 32-bit population count
  let x = n >>> 0
  x -= (x >>> 1) & 0x55555555
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  x = (x + (x >>> 4)) & 0x0f0f0f0f
  return (x * 0x01010101) >>> 24
}

// Optional diagnostics. Zero overhead unless NC_DEBUG=1 is set in the
// environment. Run e.g. `NC_DEBUG=1 oxlint path/to/file.ts` and the rule will
// print, to stderr, the parsed config and every identifier it checks (its
// computed selector + modifiers + whether a config matched).
const DEBUG =
  typeof process !== 'undefined' && !!process.env && (process.env.NC_DEBUG === '1' || process.env.NC_DEBUG === 'true')
const FLAG_NAMES = Object.fromEntries(Object.entries(S).map(([k, v]) => [v, k]))
function dbg(...args) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.error('[naming-convention:debug]', ...args)
  }
}

/* ========================================================================== *
 * Format predicates  (run on the name AFTER underscores/affixes are trimmed)
 * ========================================================================== */

function isUppercaseChar(ch) {
  return ch === ch.toUpperCase() && ch !== ch.toLowerCase()
}

function startsUpper(name) {
  return name[0] === name[0].toUpperCase() && name[0] !== name[0].toLowerCase()
}

function startsLower(name) {
  return name[0] === name[0].toLowerCase() && name[0] !== name[0].toUpperCase()
}

// No two consecutive uppercase letters, and no underscores.
function hasStrictCamelHumps(name) {
  if (name.startsWith('_')) return false
  let prevUpper = isUppercaseChar(name[0])
  for (let i = 1; i < name.length; i++) {
    const ch = name[i]
    if (ch === '_') return false
    const curUpper = isUppercaseChar(ch)
    if (prevUpper && curUpper) return false
    prevUpper = curUpper
  }
  return true
}

// No leading/trailing underscore, and no consecutive ("__") underscores.
function validateUnderscoresInBody(name) {
  if (name.startsWith('_')) return false
  let wasUnderscore = false
  for (let i = 1; i < name.length; i++) {
    if (name[i] === '_') {
      if (wasUnderscore) return false
      wasUnderscore = true
    } else {
      wasUnderscore = false
    }
  }
  return !wasUnderscore
}

const FORMAT_CHECKERS = {
  PascalCase: (name) => name.length === 0 || (startsUpper(name) && !name.includes('_')),
  StrictPascalCase: (name) => name.length === 0 || (startsUpper(name) && hasStrictCamelHumps(name)),
  camelCase: (name) => name.length === 0 || (startsLower(name) && !name.includes('_')),
  strictCamelCase: (name) => name.length === 0 || (startsLower(name) && hasStrictCamelHumps(name)),
  UPPER_CASE: (name) => name.length === 0 || (name === name.toUpperCase() && validateUnderscoresInBody(name)),
  snake_case: (name) => name.length === 0 || (name === name.toLowerCase() && validateUnderscoresInBody(name)),
}

const KNOWN_FORMATS = new Set(Object.keys(FORMAT_CHECKERS))

/* ========================================================================== *
 * Underscore + affix handling (mirrors @typescript-eslint behaviour)
 * Each returns { valid, name } where `name` has been trimmed for the next step.
 * ========================================================================== */

function handleUnderscore(position, option, name) {
  if (!option) return { valid: true, name }

  const isLeading = position === 'leading'
  const hasSingle = isLeading ? name.startsWith('_') : name.endsWith('_')
  const hasDouble = isLeading ? name.startsWith('__') : name.endsWith('__')
  const trimSingle = () => (isLeading ? name.slice(1) : name.slice(0, -1))
  const trimDouble = () => (isLeading ? name.slice(2) : name.slice(0, -2))

  switch (option) {
    case 'allow':
      return { valid: true, name: hasSingle ? trimSingle() : name }
    case 'allowDouble':
      return { valid: true, name: hasDouble ? trimDouble() : name }
    case 'allowSingleOrDouble':
      if (hasDouble) return { valid: true, name: trimDouble() }
      if (hasSingle) return { valid: true, name: trimSingle() }
      return { valid: true, name }
    case 'require':
      return hasSingle ? { valid: true, name: trimSingle() } : { valid: false, name }
    case 'requireDouble':
      return hasDouble ? { valid: true, name: trimDouble() } : { valid: false, name }
    case 'forbid':
      return { valid: !hasSingle, name }
    default:
      return { valid: true, name }
  }
}

function handleAffix(position, affixes, name) {
  if (!affixes || affixes.length === 0) return { valid: true, name }
  const isPrefix = position === 'prefix'
  for (const affix of affixes) {
    if (isPrefix ? name.startsWith(affix) : name.endsWith(affix)) {
      const trimmed = isPrefix ? name.slice(affix.length) : name.slice(0, name.length - affix.length)
      return { valid: true, name: trimmed }
    }
  }
  return { valid: false, name }
}

/* ========================================================================== *
 * Per-config validator factory
 * ========================================================================== */

function quote(name) {
  return `\`${name}\``
}

function makeValidator(cfg) {
  const { label } = cfg

  return function validate(originalName, reportNode, context) {
    // 1. custom regex (checked against the original, untrimmed name)
    if (cfg.custom) {
      const matched = cfg.custom.regex.test(originalName)
      if (matched !== cfg.custom.match) {
        report(
          context,
          reportNode,
          `${label} name ${quote(originalName)} must ${
            cfg.custom.match ? 'match' : 'not match'
          } the RegExp: /${cfg.custom.regex.source}/`,
        )
        return
      }
    }

    let name = originalName

    // 2. leading underscore
    let r = handleUnderscore('leading', cfg.leadingUnderscore, name)
    if (!r.valid) {
      report(context, reportNode, underscoreMsg(label, originalName, 'leading', cfg.leadingUnderscore))
      return
    }
    name = r.name

    // 3. trailing underscore
    r = handleUnderscore('trailing', cfg.trailingUnderscore, name)
    if (!r.valid) {
      report(context, reportNode, underscoreMsg(label, originalName, 'trailing', cfg.trailingUnderscore))
      return
    }
    name = r.name

    // 4. prefix
    let a = handleAffix('prefix', cfg.prefix, name)
    if (!a.valid) {
      report(
        context,
        reportNode,
        `${label} name ${quote(originalName)} must have one of the following prefixes: ${cfg.prefix.join(', ')}`,
      )
      return
    }
    name = a.name

    // 5. suffix
    a = handleAffix('suffix', cfg.suffix, name)
    if (!a.valid) {
      report(
        context,
        reportNode,
        `${label} name ${quote(originalName)} must have one of the following suffixes: ${cfg.suffix.join(', ')}`,
      )
      return
    }
    name = a.name

    // 6. format
    if (cfg.format && cfg.format.length > 0) {
      const ok = cfg.format.some((f) => {
        const checker = FORMAT_CHECKERS[f]
        return checker ? checker(name) : false
      })
      if (!ok) {
        const formats = cfg.format.join(', ')
        if (name === originalName) {
          report(
            context,
            reportNode,
            `${label} name ${quote(originalName)} must match one of the following formats: ${formats}`,
          )
        } else {
          report(
            context,
            reportNode,
            `${label} name ${quote(originalName)} trimmed as ${quote(name)} must match one of the following formats: ${formats}`,
          )
        }
        return
      }
    }
  }
}

function underscoreMsg(label, name, position, option) {
  if (option === 'require' || option === 'requireDouble') {
    const count = option === 'requireDouble' ? 'two' : 'a'
    return `${label} name ${quote(name)} must have ${count} ${position} underscore(s).`
  }
  // forbid
  return `${label} name ${quote(name)} must not have a ${position} underscore.`
}

/* ========================================================================== *
 * Option normalisation + specificity ordering
 * ========================================================================== */

const DEFAULT_OPTIONS = [
  {
    selector: 'default',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
    trailingUnderscore: 'allow',
  },
  { selector: 'import', format: ['camelCase', 'PascalCase'] },
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
    trailingUnderscore: 'allow',
  },
  { selector: 'typeLike', format: ['PascalCase'] },
]

let warnedAboutTypes = false
function warnTypesOnce() {
  if (warnedAboutTypes) return
  warnedAboutTypes = true
  // eslint-disable-next-line no-console
  console.warn(
    '[naming-convention] the `types` option requires type information and ' +
      'is not supported in a JS plugin; selector configs using `types` are ignored.',
  )
}

function normalizeFilter(filter) {
  if (filter == null) return null
  if (typeof filter === 'string') {
    return { regex: new RegExp(filter), match: true }
  }
  return { regex: new RegExp(filter.regex), match: filter.match !== false }
}

function normalizeCustom(custom) {
  if (custom == null) return null
  return { regex: new RegExp(custom.regex), match: custom.match !== false }
}

function normalizeOptions(rawOptions) {
  const normalized = []
  let index = 0

  for (const raw of rawOptions) {
    if (!raw || raw.selector == null) continue
    const selectors = Array.isArray(raw.selector) ? raw.selector : [raw.selector]

    // validate formats up front so misconfig is obvious
    if (raw.format) {
      for (const f of raw.format) {
        if (!KNOWN_FORMATS.has(f)) {
          // eslint-disable-next-line no-console
          console.warn(`[naming-convention] unknown format "${f}" ignored.`)
        }
      }
    }

    for (const sel of selectors) {
      const inS = Object.prototype.hasOwnProperty.call(S, sel)
      const inMeta = Object.prototype.hasOwnProperty.call(META, sel)
      if (!inS && !inMeta) {
        // eslint-disable-next-line no-console
        console.warn(`[naming-convention] unknown selector "${sel}" ignored.`)
        continue
      }

      const bits = inS ? S[sel] : META[sel]
      const cfg = {
        selector: sel,
        bits,
        isMeta: inMeta, // groups + default
        isDefault: sel === 'default',
        modifiers: Array.isArray(raw.modifiers) ? raw.modifiers.slice() : [],
        types: Array.isArray(raw.types) && raw.types.length ? raw.types : null,
        format: raw.format === undefined ? null : raw.format,
        custom: normalizeCustom(raw.custom),
        filter: normalizeFilter(raw.filter),
        leadingUnderscore: raw.leadingUnderscore || null,
        trailingUnderscore: raw.trailingUnderscore || null,
        prefix: Array.isArray(raw.prefix) && raw.prefix.length ? raw.prefix : null,
        suffix: Array.isArray(raw.suffix) && raw.suffix.length ? raw.suffix : null,
        index: index++,
        label: SELECTOR_LABELS[sel] || sel,
      }
      cfg.validator = makeValidator(cfg)
      normalized.push(cfg)
    }
  }

  return normalized
}

// Build, for every individual selector flag, the list of applicable configs
// sorted most-specific-first.
//   tier:      individual (2) > group (1) > default (0)
//   then:      more modifiers wins
//   then:      narrower group (fewer covered selectors) wins
//   then:      earlier-declared wins (stable)
function buildSelectorIndex(normalized) {
  const tier = (c) => (c.isDefault ? 0 : c.isMeta ? 1 : 2)
  const cmp = (a, b) => {
    const t = tier(b) - tier(a)
    if (t !== 0) return t
    const m = b.modifiers.length - a.modifiers.length
    if (m !== 0) return m
    if (!a.isDefault && !b.isDefault) {
      const cov = popcount(a.bits) - popcount(b.bits) // narrower first
      if (cov !== 0) return cov
    }
    return a.index - b.index
  }

  const map = new Map()
  for (const key of Object.keys(S)) {
    const flag = S[key]
    const applicable = normalized.filter((c) => c.isDefault || (c.bits & flag) !== 0).sort(cmp)
    map.set(flag, applicable)
  }
  return map
}

/* ========================================================================== *
 * Name extraction helpers
 * ========================================================================== */

const VALID_IDENT = /^[$A-Z_a-z][$A-Z_a-z0-9]*$/

// Returns { name, node, requiresQuotes } or null when no static name exists.
function keyInfo(keyNode) {
  if (!keyNode) return null
  switch (keyNode.type) {
    case 'Identifier':
      return { name: keyNode.name, node: keyNode, requiresQuotes: false }
    case 'PrivateIdentifier':
      return { name: keyNode.name, node: keyNode, requiresQuotes: false }
    case 'Literal': {
      const v = keyNode.value
      const name = String(v)
      const requiresQuotes = typeof v === 'string' ? !VALID_IDENT.test(name) : true
      return { name, node: keyNode, requiresQuotes }
    }
    default:
      return null // computed non-literal: no checkable static name
  }
}

/* ========================================================================== *
 * Scope-dependent modifiers (best effort)
 * ========================================================================== */

function isGlobalScope(node) {
  let cur = node.parent
  while (cur) {
    switch (cur.type) {
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
      case 'StaticBlock':
      case 'BlockStatement':
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement':
      case 'SwitchStatement':
      case 'CatchClause':
      case 'ClassDeclaration':
      case 'ClassExpression':
      case 'TSModuleDeclaration':
        return false
      case 'Program':
        return true
      default:
        cur = cur.parent
    }
  }
  return false
}

function unusedNames(declNode, context) {
  // best-effort; returns a Set<string> of declared names with zero references
  try {
    const sc = context && context.sourceCode
    if (!sc || typeof sc.getDeclaredVariables !== 'function') return null
    const vars = sc.getDeclaredVariables(declNode)
    if (!vars) return null
    const out = new Set()
    for (const v of vars) {
      if (v && Array.isArray(v.references) && v.references.length === 0) {
        out.add(v.name)
      }
    }
    return out
  } catch {
    return null
  }
}

/* ========================================================================== *
 * The rule
 * ========================================================================== */

const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce naming conventions for everything across a codebase ' +
        '(port of @typescript-eslint/naming-convention).',
    },
    schema: {
      type: 'array',
      items: { type: 'object', additionalProperties: true },
    },
    messages: {},
  },

  // Standard ESLint-compatible API: `create` is called once per file, AFTER
  // `context.options` has been populated for that file. So (unlike the
  // `createOnce` variant) we can read options and build the selector index
  // eagerly here. It is rebuilt per file, which is what ESLint plugins do.
  create(context) {
    const rawOptions = context.options && context.options.length > 0 ? context.options : DEFAULT_OPTIONS
    const normalized = normalizeOptions(rawOptions)
    const bySelector = buildSelectorIndex(normalized)

    if (DEBUG) {
      dbg(
        'options received:',
        JSON.stringify(context.options),
        '| usingDefaults:',
        !(context.options && context.options.length > 0),
      )
      dbg(
        'normalized selectors:',
        normalized
          .map((c) => `${c.selector}{mods:[${c.modifiers.join(',')}]${c.types ? ',types(SKIPPED)' : ''}}`)
          .join('  ') || '(none)',
      )
      dbg(`SELF-TEST  S.variable=${S.variable} (typeof ${typeof S.variable})`)
      for (const c of normalized) {
        const ownList = c.isDefault ? '(default/all)' : (bySelector.get(c.bits) || []).length
        dbg(
          `  cfg selector="${c.selector}" bits=${c.bits} (typeof ${typeof c.bits}) isDefault=${c.isDefault} isMeta=${c.isMeta} ownFlagListLen=${ownList}`,
        )
      }
      dbg(`  map keys=[${[...bySelector.keys()].join(',')}]`)
    }

    // Pick the most specific config that matches this node, then run it.
    function check(flag, modifiers, name, reportNode) {
      const list = bySelector.get(flag)
      if (DEBUG) {
        dbg(
          `check ${FLAG_NAMES[flag] || flag} name="${name}" mods=[${[...modifiers].join(',')}] candidates=${list ? list.length : 0}`,
        )
      }
      if (!list) return
      for (const cfg of list) {
        // modifiers: every required modifier must be present
        let ok = true
        for (const m of cfg.modifiers) {
          if (!modifiers.has(m)) {
            ok = false
            break
          }
        }
        if (!ok) continue

        // types: unsupported in a JS plugin -> skip this config
        if (cfg.types) {
          warnTypesOnce()
          continue
        }

        // filter: gates applicability
        if (cfg.filter) {
          const matched = cfg.filter.regex.test(name)
          if (matched !== cfg.filter.match) continue
        }

        if (DEBUG) dbg(`  -> matched config selector="${cfg.selector}"`)
        cfg.validator(name, reportNode, context)
        return // first (most specific) match wins
      }
      if (DEBUG) dbg(`  -> no config matched ${FLAG_NAMES[flag] || flag}`)
    }

    /* ---- shared sub-handlers ---------------------------------------- */

    function checkParams(fnNode) {
      const params = fnNode.params || []
      const unused = unusedNames(fnNode, context)
      for (const p of params) {
        checkParam(p, unused, false)
      }
    }

    function checkParam(p, unused, destructured) {
      if (!p) return
      switch (p.type) {
        case 'Identifier': {
          const mods = new Set()
          if (destructured) mods.add('destructured')
          if (unused && unused.has(p.name)) mods.add('unused')
          check(S.parameter, mods, p.name, p)
          break
        }
        case 'AssignmentPattern':
          checkParam(p.left, unused, destructured)
          break
        case 'RestElement':
          checkParam(p.argument, unused, destructured)
          break
        case 'ArrayPattern':
          for (const el of p.elements) checkParam(el, unused, destructured)
          break
        case 'ObjectPattern':
          for (const prop of p.properties) {
            if (prop.type === 'RestElement') {
              checkParam(prop.argument, unused, true)
            } else if (prop.type === 'Property') {
              // shorthand -> destructured parameter; renamed -> chosen name
              checkParam(prop.value, unused, prop.shorthand === true)
            }
          }
          break
        case 'TSParameterProperty': {
          const mods = new Set()
          if (p.accessibility) mods.add(p.accessibility)
          if (p.readonly) mods.add('readonly')
          if (p.override) mods.add('override')
          const inner = p.parameter
          const target = inner && inner.type === 'AssignmentPattern' ? inner.left : inner
          if (target && target.type === 'Identifier') {
            check(S.parameterProperty, mods, target.name, target)
          }
          break
        }
        default:
          break
      }
    }

    // class members (also reused by the TSAbstract* node types)
    function handleClassMember(node, opts) {
      const isAbstract = opts && opts.abstract
      if (node.kind === 'constructor') return // not checkable
      const info = keyInfo(node.key)
      if (!info) return

      const mods = new Set()
      if (node.static) mods.add('static')
      if (node.accessibility) mods.add(node.accessibility)
      if (node.override) mods.add('override')
      if (isAbstract) mods.add('abstract')
      if (info.requiresQuotes) mods.add('requiresQuotes')

      if (node.type === 'PropertyDefinition') {
        if (node.readonly) mods.add('readonly')
        if (node.value && node.value.async) mods.add('async')
        check(S.classProperty, mods, info.name, info.node)
      } else if (node.type === 'AccessorProperty') {
        check(S.autoAccessor, mods, info.name, info.node)
      } else {
        // MethodDefinition
        if (node.value && node.value.async) mods.add('async')
        if (node.kind === 'get' || node.kind === 'set') {
          check(S.classicAccessor, mods, info.name, info.node)
        } else {
          check(S.classMethod, mods, info.name, info.node)
        }
      }
    }

    function handleClassLike(node) {
      if (!node.id) return // anonymous (e.g. `export default class {}`)
      const mods = new Set()
      if (node.abstract) mods.add('abstract')
      for (const m of exportModifiers(node)) mods.add(m)
      check(S.class, mods, node.id.name, node.id)
    }

    /* ---- visitors ---------------------------------------------------- */

    return {
      // Variables -----------------------------------------------------
      VariableDeclarator(node) {
        const decl = node.parent // VariableDeclaration
        const kind = decl && decl.type === 'VariableDeclaration' ? decl.kind : 'let'

        const baseMods = []
        if (kind === 'const') baseMods.push('const')
        for (const m of exportModifiers(decl)) baseMods.push(m)
        const asyncInit =
          node.init &&
          (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression') &&
          node.init.async

        const unused = unusedNames(decl, context)

        const visit = (target, destructured) => {
          if (!target) return
          switch (target.type) {
            case 'Identifier': {
              const mods = new Set(baseMods)
              if (destructured) mods.add('destructured')
              if (asyncInit && !destructured) mods.add('async')
              if (unused && unused.has(target.name)) mods.add('unused')
              check(S.variable, mods, target.name, target)
              break
            }
            case 'ObjectPattern':
              for (const prop of target.properties) {
                if (prop.type === 'RestElement') {
                  visit(prop.argument, true)
                } else if (prop.type === 'Property') {
                  visit(prop.value, prop.shorthand === true)
                }
              }
              break
            case 'ArrayPattern':
              for (const el of target.elements) visit(el, false)
              break
            case 'AssignmentPattern':
              visit(target.left, destructured)
              break
            case 'RestElement':
              visit(target.argument, destructured)
              break
            default:
              break
          }
        }

        visit(node.id, false)
      },

      // Functions -----------------------------------------------------
      FunctionDeclaration(node) {
        if (node.id) {
          const mods = new Set()
          if (node.async) mods.add('async')
          for (const m of exportModifiers(node)) mods.add(m)
          check(S.function, mods, node.id.name, node.id)
        }
        checkParams(node)
      },
      FunctionExpression(node) {
        // named function expression: `const x = function foo() {}`
        if (node.id && (!node.parent || node.parent.type !== 'MethodDefinition')) {
          const mods = new Set()
          if (node.async) mods.add('async')
          check(S.function, mods, node.id.name, node.id)
        }
        checkParams(node)
      },
      ArrowFunctionExpression(node) {
        checkParams(node)
      },

      // Classes -------------------------------------------------------
      ClassDeclaration: handleClassLike,
      ClassExpression: handleClassLike,

      // Class members -------------------------------------------------
      MethodDefinition(node) {
        handleClassMember(node, { abstract: false })
      },
      PropertyDefinition(node) {
        handleClassMember(node, { abstract: false })
      },
      AccessorProperty(node) {
        handleClassMember(node, { abstract: false })
      },
      TSAbstractMethodDefinition(node) {
        handleClassMember(node, { abstract: true })
      },
      TSAbstractPropertyDefinition(node) {
        handleClassMember(node, { abstract: true })
      },
      TSAbstractAccessorProperty(node) {
        handleClassMember(node, { abstract: true })
      },

      // Object literal members ---------------------------------------
      Property(node) {
        // Destructuring targets live inside ObjectPattern; those are handled
        // by the variable/parameter logic, not here.
        if (node.parent && node.parent.type === 'ObjectPattern') return

        const info = keyInfo(node.key)
        if (!info) return
        const mods = new Set()
        if (info.requiresQuotes) mods.add('requiresQuotes')

        const val = node.value
        const isFn = val && (val.type === 'FunctionExpression' || val.type === 'ArrowFunctionExpression')

        if (node.kind === 'get' || node.kind === 'set') {
          check(S.classicAccessor, mods, info.name, info.node)
        } else if (node.method && isFn) {
          if (val.async) mods.add('async')
          check(S.objectLiteralMethod, mods, info.name, info.node)
        } else {
          check(S.objectLiteralProperty, mods, info.name, info.node)
        }
      },

      // Type members --------------------------------------------------
      TSPropertySignature(node) {
        const info = keyInfo(node.key)
        if (!info) return
        const mods = new Set()
        if (node.readonly) mods.add('readonly')
        if (info.requiresQuotes) mods.add('requiresQuotes')
        check(S.typeProperty, mods, info.name, info.node)
      },
      TSMethodSignature(node) {
        const info = keyInfo(node.key)
        if (!info) return
        const mods = new Set()
        if (info.requiresQuotes) mods.add('requiresQuotes')
        check(S.typeMethod, mods, info.name, info.node)
      },

      // Enums ---------------------------------------------------------
      TSEnumDeclaration(node) {
        if (!node.id) return
        const mods = new Set()
        if (node.const) mods.add('const')
        for (const m of exportModifiers(node)) mods.add(m)
        check(S.enum, mods, node.id.name, node.id)
      },
      TSEnumMember(node) {
        const info = keyInfo(node.id)
        if (!info) return
        const mods = new Set()
        if (info.requiresQuotes) mods.add('requiresQuotes')
        check(S.enumMember, mods, info.name, info.node)
      },

      // Other type-likes ---------------------------------------------
      TSInterfaceDeclaration(node) {
        if (!node.id) return
        const mods = new Set(exportModifiers(node))
        check(S.interface, mods, node.id.name, node.id)
      },
      TSTypeAliasDeclaration(node) {
        if (!node.id) return
        const mods = new Set(exportModifiers(node))
        check(S.typeAlias, mods, node.id.name, node.id)
      },
      TSTypeParameter(node) {
        const name = node.name && typeof node.name === 'object' ? node.name.name : node.name
        const reportNode = node.name && typeof node.name === 'object' ? node.name : node
        if (name) check(S.typeParameter, new Set(), name, reportNode)
      },

      // Imports -------------------------------------------------------
      ImportDefaultSpecifier(node) {
        if (node.local) {
          check(S.import, new Set(['default']), node.local.name, node.local)
        }
      },
      ImportNamespaceSpecifier(node) {
        if (node.local) {
          check(S.import, new Set(['namespace']), node.local.name, node.local)
        }
      },
      ImportSpecifier(node) {
        if (node.local) {
          check(S.import, new Set(), node.local.name, node.local)
        }
      },
    }
  },
}

/* ========================================================================== *
 * shared helper that needs `isGlobalScope`
 * ========================================================================== */

function exportModifiers(declNode) {
  const mods = []
  const p = declNode && declNode.parent
  if (p && p.type === 'ExportNamedDeclaration') mods.push('exported')
  if (p && p.type === 'ExportDefaultDeclaration') {
    mods.push('exported')
    mods.push('default')
  }
  if (declNode && isGlobalScope(declNode)) mods.push('global')
  return mods
}

function report(context, node, message) {
  context.report({ node, message })
}

/* ========================================================================== *
 * Plugin export
 * ========================================================================== */

// Plain ESLint-compatible plugin object. No `eslintCompatPlugin` wrapper and
// no "@oxlint/plugins" dependency: the rule exposes a standard `create`, so
// Oxlint and ESLint consume it identically.
const plugin = {
  meta: {
    name: 'naming-convention',
  },
  rules: {
    'naming-convention': rule,
  },
}

export default plugin

// Named exports: useful for unit-testing and reuse. They do not affect how
// Oxlint or ESLint consume the plugin (both use the default export).
export { FORMAT_CHECKERS, handleUnderscore, handleAffix, normalizeOptions, buildSelectorIndex, S, META }
