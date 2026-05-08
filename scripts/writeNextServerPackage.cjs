const { mkdirSync, writeFileSync } = require('node:fs')
const path = require('node:path')

const appPath = process.argv[2]

if (!appPath) {
  throw new Error('Usage: node scripts/writeNextServerPackage.cjs <app-path>')
}

const appRoot = path.resolve(process.cwd(), appPath)
const packageJson = `${JSON.stringify({ type: 'commonjs' })}\n`

for (const relativePath of ['.next/package.json', '.next/server/package.json']) {
  const targetPath = path.join(appRoot, relativePath)
  mkdirSync(path.dirname(targetPath), { recursive: true })
  writeFileSync(targetPath, packageJson)
}
