import { cn } from '@/lib/utils'
import { COLOR_PAIRINGS, COLOR_TOKENS } from '../design-tokens'
import { TokenName } from './token-name'

export function ColorTokens(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {COLOR_TOKENS.map(({ name, utility, swatchClassName }) => (
          <li key={name} className="flex flex-col gap-2 rounded-field bg-raised p-2">
            <span
              aria-hidden="true"
              className={cn('h-10 rounded-thumb border border-rule', swatchClassName)}
            />
            <TokenName name={name} detail={utility} />
          </li>
        ))}
      </ul>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {COLOR_PAIRINGS.map(({ name, className }) => (
          <li
            key={name}
            className={cn(
              'rounded-field border border-rule px-3 py-2 font-mono text-small',
              className,
            )}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
