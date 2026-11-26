import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function PlusIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M36 16v40M16 36h40" />
    </LineIcon>
  )
}
