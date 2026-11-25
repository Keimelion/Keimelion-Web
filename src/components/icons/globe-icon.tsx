import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function GlobeIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="36" cy="36" r="24" />
      <path d="M12 36h48M36 12c-8 8-8 40 0 48M36 12c8 8 8 40 0 48" />
    </LineIcon>
  )
}
