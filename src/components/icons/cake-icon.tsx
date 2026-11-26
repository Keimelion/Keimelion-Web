import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CakeIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M14 58V38h44v20z" />
      <path d="M14 46c6 4 10 4 14 0s10-4 14 0 10 4 16 0" />
      <path d="M36 38V28" />
      <path d="M36 22c-2 2-2 4 0 6 2-2 2-4 0-6z" />
      <path d="M8 58h56" />
    </LineIcon>
  )
}
