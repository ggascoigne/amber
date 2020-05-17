export async function sleep(ms: number) {
  await new Promise((resolve: any) => {
    setTimeout(() => resolve(ms), ms)
  })
  console.log(`slept for ${ms}ms`)
}
