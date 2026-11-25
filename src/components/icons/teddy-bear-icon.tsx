import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function TeddyBearIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="36" cy="40" r="16" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="48" cy="24" r="6" />
      <circle cx="30" cy="38" r="1" />
      <circle cx="42" cy="38" r="1" />
      <path d="M32 46q4 3 8 0" />
    </LineIcon>
  )
}
