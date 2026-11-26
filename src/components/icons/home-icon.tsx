import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function HomeIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M12 34l24-20 24 20" />
      <path d="M18 30v28h36V30" />
    </LineIcon>
  )
}
