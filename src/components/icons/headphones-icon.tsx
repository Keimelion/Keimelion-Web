import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function HeadphonesIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M14 46V38a22 22 0 0 1 44 0v8" />
      <rect x="10" y="42" width="12" height="18" rx="5" />
      <rect x="50" y="42" width="12" height="18" rx="5" />
    </LineIcon>
  )
}
