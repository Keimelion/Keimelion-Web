import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function CasseroleIcon({
  weight = LineIconWeights.FINE,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <path d="M14 32h44v14a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z" />
      <path d="M8 32h56" />
      <path d="M30 32v-3a6 6 0 0 1 12 0v3" />
    </LineIcon>
  )
}
