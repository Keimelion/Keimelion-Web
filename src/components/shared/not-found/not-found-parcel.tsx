'use client'

import { usePathname } from 'next/navigation'
import { LostParcel } from '@/components/shared/lost-parcel'

const MAX_PAGE_LABEL_LENGTH = 10
const ELLIPSIS = '…'

interface NotFoundParcelProps {
  stampLabel: string
  addressLabel: string
  fallbackPageLabel: string
  className?: string | undefined
}

export function NotFoundParcel({
  stampLabel,
  addressLabel,
  fallbackPageLabel,
  className,
}: NotFoundParcelProps): React.JSX.Element {
  const pathname = usePathname()
  return (
    <LostParcel
      stampLabel={stampLabel}
      addressLabel={addressLabel}
      pageLabel={toPageLabel(pathname) ?? fallbackPageLabel}
      className={className}
    />
  )
}

function toPageLabel(pathname: string | null): string | null {
  const path = decodePath(pathname ?? '').replace(/^\/+/, '')
  if (path === '') return null
  if (path.length <= MAX_PAGE_LABEL_LENGTH) return path
  return `${path.slice(0, MAX_PAGE_LABEL_LENGTH - ELLIPSIS.length)}${ELLIPSIS}`
}

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}
