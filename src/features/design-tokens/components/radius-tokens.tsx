import { cn } from '@/lib/utils'
import { RADII } from '../design-tokens'
import { TokenName } from './token-name'

export function RadiusTokens(): React.JSX.Element {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {RADII.map(({ name, size, className }) => (
        <li key={name} className="flex flex-col gap-2">
          <span
            aria-hidden="true"
            className={cn('h-16 border-2 border-rule-strong bg-raised', className)}
          />
          <TokenName name={`radius-${name}`} detail={size} />
        </li>
      ))}
    </ul>
  )
}
