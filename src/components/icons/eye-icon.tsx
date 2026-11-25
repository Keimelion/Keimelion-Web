import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function EyeIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M8 36s10-18 28-18 28 18 28 18-10 18-28 18S8 36 8 36z" />
      <circle cx="36" cy="36" r="8" />
    </LineIcon>
  )
}
