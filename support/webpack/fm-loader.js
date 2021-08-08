// See the patch-package patch for react-scripts
// and https://mdxjs.com/guides/custom-loader

const matter = require('gray-matter')
const stringifyObject = require('stringify-object')

module.exports = async function (src) {
  const callback = this.async()
  const { content, data } = matter(src)

  const code = `export const frontMatter = ${stringifyObject(data)}

${content}`

  return callback(null, code)
}
