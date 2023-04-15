import { useRouter } from 'next/router'

import { useConfiguration } from './configContext'

const pattern = /(?<base>\/.*?)\/(?<year>\d+)(?:\/(?<slot>\d+))?/

export const useGameUrl = () => {
  const configuration = useConfiguration()
  const router = useRouter()
  const match = pattern.exec(router.asPath)
  // note that we can't just use useParams since we're not the routed-to component
  const base = match?.groups?.base
  const yearStr = match?.groups?.year
  const slotIdStr = match?.groups?.slot
  const hash = router.asPath.split('#')?.[1] || ''
  const slot = slotIdStr ? parseInt(slotIdStr, 10) : 1
  const year = yearStr ? parseInt(yearStr, 10) : configuration.year
  return { base, year, slot, hash }
}
