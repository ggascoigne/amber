#!/usr/bin/env TS_NODE_PROJECT=./tsconfig.oclif.json node

// note that depends on patches/@oclif+config+1.17.0.patch

// this is the oclif wrapper for the commands found in /shared/cliCommands

require('dotenv').config()
require('@oclif/command').run().then(require('@oclif/command/flush')).catch(require('@oclif/errors/handle'))
