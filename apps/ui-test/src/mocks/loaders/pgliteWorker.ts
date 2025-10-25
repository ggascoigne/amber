import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'

export default worker({
  async init() {
    // Create and return a PGlite instance
    return new PGlite(
      // note that the -3 here is the database version
      'idb://pglite-worker-4',
      {
        relaxedDurability: true,
        // debug: 5
      },
    )
  },
})
