import { SiteShell } from '@/components/shared/site-shell'

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <SiteShell>{children}</SiteShell>
}
