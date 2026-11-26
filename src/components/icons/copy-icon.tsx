import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CopyIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="24" y="24" width="32" height="32" rx="6" />
      <path d="M16 46V20a4 4 0 0 1 4-4h26" />
    </LineIcon>
  )
}
