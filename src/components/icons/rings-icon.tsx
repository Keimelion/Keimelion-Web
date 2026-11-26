import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function RingsIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="28" cy="42" r="14" />
      <circle cx="44" cy="42" r="14" />
      <path d="M24 22l4-6 4 6" />
    </LineIcon>
  )
}
