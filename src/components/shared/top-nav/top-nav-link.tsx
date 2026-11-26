'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isPathWithin } from '@/lib/app-paths'
import { cn } from '@/lib/utils'

interface TopNavLinkProps {
  href: string
  children: React.ReactNode
}

export function TopNavLink({ href, children }: TopNavLinkProps): React.JSX.Element {
  const pathname = usePathname()
  const isActive = isPathWithin(pathname, href)
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'px-0.5 py-1.5 text-[15px] font-semibold transition-press hover:text-ink',
        isActive ? 'text-ink shadow-[inset_0_-2px_0_var(--brand)]' : 'text-muted-foreground',
      )}
    >
      {children}
    </Link>
  )
}
