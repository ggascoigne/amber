/* eslint-disable strict */
// based on https://github.com/ljharb/qs/issues/404#issuecomment-805930092

// This shim fixes a downstream dependency of the qs library that is used in here
// that in turn uses object-inspect that has an import that breaks when compiled by Vite.
// It turns out that qs only uses side-channel for some of it's error reporting and it can
//  by bypassed completely to avoid pulling in object-inspect, doing so substantially
// shrinks the bundle size at the cost of a bit of error detail. More importantly it
// fixes the error.

// If you don't use Vite, then you don't need this shim, or the relevant change in
// the vite-config.mjs.
'use strict'

module.exports = function getSideChannel() {
  const store = new WeakMap()
  return {
    get(key) {
      return store.get(key)
    },
    set(key, value) {
      store.set(key, value)
    },
    has(key) {
      return store.has(key)
    },
  }
}
