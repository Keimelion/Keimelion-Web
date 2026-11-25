import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function LinkIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M30 42l12-12" />
      <path d="M26 34l-6 6a8 8 0 0 0 12 12l6-6" />
      <path d="M46 38l6-6a8 8 0 0 0-12-12l-6 6" />
    </LineIcon>
  )
}
