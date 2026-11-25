import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function PlantIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M24 44h24l-4 18H28z" />
      <path d="M36 44V24" />
      <path d="M36 32c-9 0-13-6-13-13 9 0 13 6 13 13z" />
      <path d="M36 28c9 0 13-6 13-13-9 0-13 6-13 13z" />
    </LineIcon>
  )
}
