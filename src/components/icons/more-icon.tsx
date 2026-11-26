import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function MoreIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="18" cy="36" r="3" />
      <circle cx="36" cy="36" r="3" />
      <circle cx="54" cy="36" r="3" />
    </LineIcon>
  )
}
