#! /usr/bin/env node
const fs = require('fs')
const execa = require('execa')
const meow = require('meow')

// Reformat a single file using `import-sort | prettier`
// designed to be called from a file change watcher from inside IntellliJ IDEA
// since there seems to be a race condition calling two separate file watchers
// on the same file, and it appears to be rather random which one generates the
// output. By explicitly running each piping the output of the first into the
// second seems to be pretty reliable.

const cli = meow(
  `
Usage
  $ node scripts/format filename

Options
  --help, -h  Show this help message
`,
  {
    description: 'format'
  }
)

void (async function go() {
  const filename = cli.input[0]
  !filename && cli.showHelp()

  // note that this really only works on *.{js,jsx,ts,tsx} files, others error out but don't change the input
  // todo clean up error handling
  // todo pass other supported file types through to prettier

  const sorter = execa('./node_modules/.bin/import-sort', [filename], {
    stdin: 'inherit'
  })

  const prettier = execa('./node_modules/.bin/prettier', ['--stdin', '--stdin-filepath', filename], {
    stripFinalNewline: false
  })
  sorter.stdout.pipe(prettier.stdin)
  await sorter
  const { stdout: processedText } = await prettier
  fs.writeFileSync(filename, processedText, { encoding: 'utf-8' })
  fs.writeFileSync(filename, '\n', { flag: 'a', encoding: 'utf-8' })
})()
