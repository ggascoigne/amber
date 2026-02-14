import { seed } from '../testData'

export const testSeedTask = {
  title: `Creating Test Data`,
  task: async () => seed(),
}
