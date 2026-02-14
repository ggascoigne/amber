import type { ListrTask } from 'listr2'

import type { TaskContext } from '../taskContext'

export const debugTask: ListrTask = {
  title: `debug`,
  task: (ctx: TaskContext) => {
    console.log('context', ctx)
  },
}
