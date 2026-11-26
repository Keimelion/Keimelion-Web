import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function KeyIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="22" cy="36" r="11" />
      <path d="M33 36h29M55 36v8M62 36v5" />
    </LineIcon>
  )
}
