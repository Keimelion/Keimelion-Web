import { Skeleton } from '@/components/ui/skeleton'

const SKELETON_CARD_KEYS = ['first', 'second', 'third'] as const
const SKELETON_THUMB_KEYS = ['first', 'second', 'third'] as const

interface ListsSkeletonProps {
  loadingLabel: string
}

export function ListsSkeleton({ loadingLabel }: ListsSkeletonProps): React.JSX.Element {
  return (
    <div role="status" className="grid gap-3 lg:grid-cols-3 lg:gap-5">
      <span className="sr-only">{loadingLabel}</span>
      {SKELETON_CARD_KEYS.map((cardKey) => (
        <div key={cardKey} className="flex flex-col gap-3 rounded-card bg-raised p-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-5 w-52 max-w-full" />
          <div className="flex gap-1.5">
            {SKELETON_THUMB_KEYS.map((thumbKey) => (
              <Skeleton key={thumbKey} className="size-10 rounded-[10px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
