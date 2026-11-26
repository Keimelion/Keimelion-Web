import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CandleIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="26" y="30" width="20" height="30" rx="3" />
      <path d="M36 30v-6" />
      <path d="M36 10c4 4 4 8 0 10-4-2-4-6 0-10z" />
    </LineIcon>
  )
}
