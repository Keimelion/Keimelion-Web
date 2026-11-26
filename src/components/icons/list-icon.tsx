import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function ListIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M26 20h32M26 36h32M26 52h32" />
      <circle cx="15" cy="20" r="3" />
      <circle cx="15" cy="36" r="3" />
      <circle cx="15" cy="52" r="3" />
    </LineIcon>
  )
}
