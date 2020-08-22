export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  const argv = process.argv.slice(2)
  argv.length && (await sleep(parseInt(argv[0]) * 1000))
}
main().then()
