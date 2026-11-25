import { LineIcon, LineIconWeights } from './line-icon'
import type { LineIconProps } from './line-icon'

export function GiftIcon({
  weight = LineIconWeights.REGULAR,
  ...props
}: LineIconProps): React.JSX.Element {
  return (
    <LineIcon weight={weight} {...props}>
      <rect x="12" y="28" width="48" height="32" rx="4" />
      <path d="M36 28v32M12 40h48" />
      <path d="M36 28c-4-10-14-10-14-4s10 4 14 4c4 0 14 2 14-4s-10-6-14 4z" />
    </LineIcon>
  )
}
