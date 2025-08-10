import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

export const Redirect = ({ to }: { to: string }) => {
  const router = useRouter()
  useEffect(() => {
    router.push(to)
  }, [router, to])
  return null
}
