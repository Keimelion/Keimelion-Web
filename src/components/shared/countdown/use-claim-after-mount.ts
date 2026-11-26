'use client'

import { useEffect, useState } from 'react'

export function useClaimAfterMount(claim: () => boolean, claimKey: string): boolean {
  const [isClaimed, setIsClaimed] = useState(false)
  useEffect(() => {
    if (claim()) setIsClaimed(true)
  }, [claimKey])
  return isClaimed
}
