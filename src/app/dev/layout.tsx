import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { GuestShell } from '@/components/shared/guest-shell'
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
  return <GuestShell>{children}</GuestShell>
}
