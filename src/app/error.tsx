'use client'

import { RouteErrorState } from '@/components/shared/error-state'

interface RootErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootErrorPage({ error, reset }: RootErrorPageProps): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col px-4">
      <RouteErrorState error={error} reset={reset} />
    </div>
  )
}
