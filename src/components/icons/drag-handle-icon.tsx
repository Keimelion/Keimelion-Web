import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function DragHandleIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <circle cx="28" cy="22" r="3" />
      <circle cx="44" cy="22" r="3" />
      <circle cx="28" cy="36" r="3" />
      <circle cx="44" cy="36" r="3" />
      <circle cx="28" cy="50" r="3" />
      <circle cx="44" cy="50" r="3" />
    </LineIcon>
  )
}
