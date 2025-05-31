import path from 'path'
import { fileURLToPath } from 'url'

/**
 * @typedef {Object} Paths
 * @property {string} filename - The full path to the file
 * @property {string} dirname - The directory path of the file
 */

/**
 * Get the filename and dirname from a meta URL
 * @param {string} metaUrl - The meta URL of the module
 * @returns {Paths} An object containing filename and dirname
 */

export const getPaths = (metaUrl) => {
  const filename = fileURLToPath(metaUrl)
  const dirname = path.dirname(filename)
  return { filename, dirname }
}
