#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

const oclif = require('@oclif/core')

const project = path.join(__dirname, '..', 'tsconfig.json')

// In dev mode -> use ts-node and dev plugins
process.env.NODE_ENV = 'development'

require('ts-node').register({ project })
require('tsconfig-paths').register()

// In dev mode, always show stack traces
oclif.settings.debug = true

// Start the CLI
oclif.run().then(oclif.flush).catch(oclif.Errors.handle)
