async function sleep (ms) {
  await new Promise(resolve => {
    setTimeout(() => resolve(ms), ms)
  })
  console.log(`slept for ${ms}ms`)
}

exports.sleep = sleep
