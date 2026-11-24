import { TYPE_SCALE } from '../design-tokens'
import { TokenName } from './token-name'

interface TypeScaleProps {
  sample: string
}

export function TypeScale({ sample }: TypeScaleProps): React.JSX.Element {
  return (
    <ul className="flex flex-col gap-4">
      {TYPE_SCALE.map(({ name, spec, className }) => (
        <li key={name} className="flex flex-col gap-1 border-b border-rule pb-4">
          <p className={className}>{sample}</p>
          <TokenName name={`text-${name}`} detail={spec} />
        </li>
      ))}
    </ul>
  )
}
