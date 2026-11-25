import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function BikeIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="20" cy="46" r="10" />
      <circle cx="52" cy="46" r="10" />
      <path d="M20 46l10-18h14l8 18M30 28l8 18h-8" />
      <path d="M40 22h8" />
    </LineIcon>
  )
}
