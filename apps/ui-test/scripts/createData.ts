import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createUserData } from './data/user'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/mocks/data')

await createUserData(dir)
