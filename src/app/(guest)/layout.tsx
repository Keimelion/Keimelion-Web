import { GuestShell } from '@/components/shared/guest-shell'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return <GuestShell>{children}</GuestShell>
}
