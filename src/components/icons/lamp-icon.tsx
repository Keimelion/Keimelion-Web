import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function LampIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M24 12h24l8 22H16z" />
      <path d="M36 34v24" />
      <path d="M24 60h24" />
    </LineIcon>
  )
}
