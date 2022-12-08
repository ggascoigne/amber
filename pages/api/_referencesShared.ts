import fs from 'fs'

export const ensureShared = () => {
  try {
    // force a file access to force next.js to include the files in the serverless bundle
    const _arrayOfFiles = fs.readdirSync(`${process.cwd()}/shared`)
  } catch (e) {
    console.log(e)
  }
}
