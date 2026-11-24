import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { SiteShell } from '@/components/shared/site-shell'
import { areDevPagesEnabled } from '@/lib/dev-pages'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DevLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.JSX.Element> {
  await connection()
  if (!areDevPagesEnabled()) notFound()
  return <SiteShell>{children}</SiteShell>
}
