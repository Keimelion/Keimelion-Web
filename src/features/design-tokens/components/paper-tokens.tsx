import { cn } from '@/lib/utils'
import { OCCASION_PAPER_CLASS_NAMES, OccasionPapers } from '@/lib/occasions/occasion-paper'
import { TokenName } from './token-name'

const PAPERS = Object.values(OccasionPapers)

export function PaperTokens(): React.JSX.Element {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PAPERS.map((paper) => (
        <li key={paper} className="flex flex-col gap-2 rounded-field bg-raised p-2">
          <span
            className={cn(
              'flex h-14 items-end rounded-thumb p-2 font-mono text-label text-ink uppercase',
              OCCASION_PAPER_CLASS_NAMES[paper].paper,
            )}
          >
            {paper}
          </span>
          <GiftSwatch className={OCCASION_PAPER_CLASS_NAMES[paper].gift} />
          <TokenName name={`paper-${paper}`} detail={`gift-${paper}`} />
        </li>
      ))}
    </ul>
  )
}

interface GiftSwatchProps {
  className: string
}

function GiftSwatch({ className }: GiftSwatchProps): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn('relative h-14 overflow-hidden rounded-thumb', className)}
    >
      <span className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-gift-ribbon" />
      <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-gift-ribbon" />
    </span>
  )
}
