import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function LockIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="16" y="32" width="40" height="28" rx="6" />
      <path d="M24 32v-8a12 12 0 0 1 24 0v8" />
    </LineIcon>
  )
}
