import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

import { expect, test as base } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

type JsCoverageEntries = Awaited<ReturnType<Page['coverage']['stopJSCoverage']>>
type CssCoverageEntries = Awaited<ReturnType<Page['coverage']['stopCSSCoverage']>>

type CoveragePayload = {
  css: CssCoverageEntries
  js: JsCoverageEntries
}

const coverageEnabled = process.env.PLAYWRIGHT_COVERAGE === '1' || process.env.PLAYWRIGHT_COVERAGE === 'true'

const sanitizeCoverageSegment = (value: string) => value.replace(/[^a-z0-9-]+/gi, '_').replace(/(^_+|_+$)/g, '')

const resolveCoveragePaths = (testInfo: TestInfo) => {
  const projectRoot = path.resolve(testInfo.project.outputDir, '..')
  const coverageDir = path.join(projectRoot, 'coverage', 'playwright')
  const titleSegments: Array<string> = [testInfo.project.name, ...testInfo.titlePath]
  const fileBaseName = titleSegments
    .map((segment) => sanitizeCoverageSegment(segment))
    .filter((segment) => segment.length > 0)
    .join('--')
  const fileName = fileBaseName ? `${fileBaseName}.json` : 'coverage.json'

  return { coverageDir, filePath: path.join(coverageDir, fileName) }
}

const writeCoverage = async (testInfo: TestInfo, payload: CoveragePayload) => {
  const { coverageDir, filePath } = resolveCoveragePaths(testInfo)
  await mkdir(coverageDir, { recursive: true })
  await writeFile(filePath, JSON.stringify(payload, null, 2))
}

const stopCoverageSafely = async <CoverageEntriesType extends Array<unknown>>(
  stopper: () => Promise<CoverageEntriesType>,
): Promise<CoverageEntriesType> => {
  try {
    return await stopper()
  } catch {
    return [] as CoverageEntriesType
  }
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (!coverageEnabled) {
      await use(page)
      return
    }

    await page.coverage.startJSCoverage({ resetOnNavigation: false })
    await page.coverage.startCSSCoverage({ resetOnNavigation: false })

    try {
      await use(page)
    } finally {
      const jsCoverage = await stopCoverageSafely(() => page.coverage.stopJSCoverage())
      const cssCoverage = await stopCoverageSafely(() => page.coverage.stopCSSCoverage())
      await writeCoverage(testInfo, { css: cssCoverage, js: jsCoverage })
    }
  },
})

export { expect }
