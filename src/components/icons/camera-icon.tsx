import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CameraIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="12" y="22" width="48" height="34" rx="6" />
      <circle cx="36" cy="39" r="10" />
      <path d="M24 22l4-6h16l4 6" />
    </LineIcon>
  )
}
